const userRouter = require("express").Router();
const { getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, searchUser } = require("../controllers/userControllers");
const authUser = require("../middleware/authUser");

userRouter.get("/profile/:username", getUserProfile)
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.put("/follow/:id", authUser, followUnfollowUser);
userRouter.put("/update/:id", authUser, updateUser);
userRouter.get("/all", authUser, searchUser);

module.exports = userRouter;