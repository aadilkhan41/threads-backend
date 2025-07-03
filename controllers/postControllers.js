const Post = require("../models/posts");
const User = require("../models/users");
const { createPostObject } = require("../utils/types/zod");
const {v2: cloudinary} = require("cloudinary");

const getPost = async (req,res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("postedBy");
    if(!post) return res.status(404).json({message: "Post not found"})
    res.status(200).json(post);
}

const createPost = async (req,res) => {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    createPostObject.parse({ postedBy, text });
    const userWhoCreatesPost = await User.findById(postedBy);

    if(!userWhoCreatesPost) return res.status(404).json({message: "User Not Found"});
    if(userWhoCreatesPost._id.toString() !== req.user._id.toString()) return res.status(401).json({message: "Unauthorized to create a post"});
    
    if(img) {
        const uploadedImage = await cloudinary.uploader.upload(img);
        img = uploadedImage.secure_url;
    }

    const post = new Post({ postedBy, text, img });
    const savedPost = await post.save();

    await User.findByIdAndUpdate(postedBy, {
        $push: {posts: savedPost._id}
    }, {new: true, runValidators: true, context: "query"})

    const user = await User.findById(postedBy);
    return res.status(201).json({savedPost, user});
}

const deletePost = async (req,res) => {
    const postId = req.params.id;
    const userWhoDeletes = req.user;
    const postTobeDeleted = await Post.findById(postId);

    if(!postTobeDeleted) return res.status(404).json({message: "Post not found"});
    if(postTobeDeleted.postedBy.toString() !== userWhoDeletes._id.toString()) return res.status(401).json({message: "Unauthorized to delete the post"});
    
    if(postTobeDeleted.img) {
        const imgId = postTobeDeleted.img?.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
    }

    await User.findByIdAndUpdate(userWhoDeletes._id, {
        $pull: {posts: postId}
    }, {new: true, runValidators: true, context: "query"});

    await Post.findByIdAndDelete(postId);
    res.status(200).json({message: "Post deleted successfully"});
}

const likeUnlikePost = async (req,res) => {
    const postId = req.params.id;
    const userWhoLikes = req.user;
    const userId = userWhoLikes._id.toString();
    const post = await Post.findById(postId).select("-password").select("-updatedAt");

    if(!post) return res.status(404).json({message: "Post not found"});
    const isLiked = post.likes.includes(userId);

    if(isLiked) {
        await Post.updateOne({_id: postId}, {
            $pull: {likes: userId}
        });

        const user = await User.findById(userId).select("-password").select("-updatedAt");
        return res.status(200).json({message: "Post unliked successfully", user});
    }
    else {
        await Post.updateOne({_id: postId}, {
            $push: {likes: userId}
        });

        const user = await User.findById(userId);
        return res.status(200).json({message: "Post liked successfully", user});
    }
}

const replyPost = async (req,res) => {
    const postId = req.params.id;
    const userWhoReplies = req.user;
    const userId = userWhoReplies._id.toString();
    const { text } = req.body;
    const post = await Post.findById(postId);

    if(!post) return res.status(404).json({message: "Post not found"})

    const reply = {
        userId,
        text,
        userProfilePic: userWhoReplies.profilePic,
        username: userWhoReplies.username
    }

    post.replies = post.replies.concat(reply);
    await post.save();
    res.status(201).json({
        message: "Reply added to the post successfully", reply
    });
}

const feedPost = async (req,res) => {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({message: "User not found"});
    const posts = await Post.find({postedBy: {$in: user.following}}).sort({createdAt: -1}).populate("postedBy");
    if(!posts) return res.status(404).json({message: "Posts not found"});
    res.status(200).json(posts);
}

module.exports = {createPost, getPost, deletePost, likeUnlikePost, replyPost, feedPost};