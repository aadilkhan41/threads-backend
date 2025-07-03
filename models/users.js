const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        minLength: 2,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    }, 
    following: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ""
    }, 
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
}, {
    timestamps: true,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;