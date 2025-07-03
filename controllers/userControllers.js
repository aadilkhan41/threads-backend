const Post = require("../models/posts");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { signupObject, loginObject, updateProfileObject } = require("../utils/types/zod");
const { v2: cloudinary } = require("cloudinary");

const signupUser = async (req, res) => {
    const { name, email, username, password } = req.body;
    signupObject.parse({ name, username, email, password });
    const isExistingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    console.log("Hello");

    if (isExistingUser) return res.status(400).json({ message: "User already exists! Please Log in" });
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
    });

    await user.save();

    if (user) {
        generateToken(user._id, res);
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic,
            followers: [],
            following: [],
        });
    } else {
        return res.status(400).json({ error: "Invalid user credentials!" });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    loginObject.parse({
        username,
        password,
    });

    const isExistingUser = await User.findOne({ username });
    const isPasswordEqual = await bcrypt.compare(
        password,
        isExistingUser?.password || ""
    );

    if (!isExistingUser || !isPasswordEqual) {
        return res
            .status(404)
            .json({ message: "Invalid username or password!!" });
    }

    generateToken(isExistingUser._id, res);

    return res.status(200).json({
        _id: isExistingUser._id,
        name: isExistingUser.name,
        username: isExistingUser.username,
        email: isExistingUser.email,
        bio: isExistingUser.bio,
        profilePic: isExistingUser.profilePic,
        following: isExistingUser.following,
        followers: isExistingUser.followers,
    });
};

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 1,
    });
    res.status(200).json({ message: "User logged out successfully!!" });
};

const followUnfollowUser = async (req, res) => {
    const id = req.params.id;
    const userToBeFollowed = await User.findById(id);
    const userWhoFollows = req.user;
    if (!userToBeFollowed || !userWhoFollows) return res.status(404).json({ message: "User not found" });
    
    if (userWhoFollows._id.toString() === id) {
        return res
            .status(400)
            .json({ message: "You cannot follow or unfollow yourself" });
    }

    const isFollowing = userToBeFollowed.followers.includes(userWhoFollows._id);

    if (isFollowing) {
        await User.findByIdAndUpdate(
            userWhoFollows._id.toString(),
            {
                $pull: { following: id },
            },
            { new: true, runValidators: true, context: "query" }
        );

        await User.findByIdAndUpdate(
            id,
            {
                $pull: { followers: userWhoFollows._id.toString() },
            },
            { new: true, runValidators: true, context: "query" }
        );

        const user = await User.findById(userWhoFollows._id.toString()).select(
            "-password"
        );

        res.status(200).json({
            user,
            message: `You have unfollowed ${userToBeFollowed.username}`,
            status: false,
        });
    } else {
        await User.findByIdAndUpdate(
            userWhoFollows._id.toString(),
            {
                $push: { following: id },
            },
            { new: true, runValidators: true, context: "query" }
        );

        await User.findByIdAndUpdate(
            id,
            {
                $push: { followers: userWhoFollows._id.toString() },
            },
            { new: true, runValidators: true, context: "query" }
        );

        const user = await User.findById(userWhoFollows._id.toString()).select(
            "-password"
        );

        res.status(200).json({
            user,
            message: `You have followed ${userToBeFollowed.username}`,
            status: true,
        });
    }
};

const updateUser = async (req, res) => {
    const userTobeUpdated = req.user;
    const { name, username, email, password, bio } = req.body;
    let { profilePic } = req.body;
    
    updateProfileObject.parse({
        name,
        username,
        email,
        password,
        bio,
        profilePic,
    });

    const userId = userTobeUpdated?._id.toString();

    if (req.params.id !== userId) {
        return res.status(404).json({ message: "You cannot update other's profile" });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (password) {
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
    }

    if (profilePic) {
        if (user.profilePic) {
            await cloudinary.uploader.destroy(
                user.profilePic?.split("/").pop().split(".")[0]
            );
        }
        
        const response = await cloudinary.uploader.upload(profilePic);
        profilePic = response.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    await user.save();
    user.password = null;
    const posts = await Post.find({});

    await Promise.all(
        posts?.map(async (post) => {
            const replies = post?.replies?.map((reply) => {
                if (reply?.userId?.toString() === userId) {
                    const newReply = {
                        ...reply,
                        userProfilePic: user.profilePic,
                        username: user.username,
                    };
                    return newReply;
                } else {
                    return reply;
                }
            });
            post.replies = replies;
            await post.save();
        })
    );

    res.status(200).json(user);
};

const getUserProfile = async (req, res) => {
    const { username } = req.params;

    const getUser = await User.findOne({ username })
        .select("-password")
        .select("-updatedAt")
        .populate("posts");

    if (!getUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(getUser);
};

const searchUser = async (req, res) => {
    const usernameQuery = req.query.filter;

    if (!usernameQuery) return res.status(200).json([]);

    const users = await User.find({
        $or: [
            {
                username: {
                    $regex: usernameQuery,
                },
            },
            {
                name: {
                    $regex: usernameQuery,
                },
            },
        ],
    }).select("-password");

    return res.status(200).json(users);
};

module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    followUnfollowUser,
    updateUser,
    getUserProfile,
    searchUser,
};