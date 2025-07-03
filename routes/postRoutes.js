const { createPost, getPost, deletePost, likeUnlikePost, replyPost, feedPost } = require("../controllers/postControllers");
const authUser = require("../middleware/authUser");
const postRouter = require("express").Router();

postRouter.get("/feed", authUser, feedPost);
postRouter.get("/:id", getPost);
postRouter.post("/create", authUser, createPost);
postRouter.delete("/delete/:id", authUser, deletePost);
postRouter.put("/like/:id", authUser, likeUnlikePost);
postRouter.put("/reply/:id", authUser, replyPost);

module.exports = postRouter;