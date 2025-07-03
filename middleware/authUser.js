const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");

const authUser = async (req, res, next) => {
    const cookie = req.cookies;
    const user = jwt.verify(cookie.jwt, JWT_SECRET);
    const isExistingUser = await User.findById(user.userId).select("-password");
    req.user = isExistingUser;
    next();
};

module.exports = authUser;