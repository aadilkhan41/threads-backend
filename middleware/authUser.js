const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");

const authUser = async (req, res, next) => {
	try {
		const token = req.cookies?.jwt;

		if (!token) {
			return res.status(401).json({ message: "No token. Unauthorized access." });
		}

		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(401).json({ message: "User not found. Unauthorized." });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("authUser middleware error:", err.message);
		return res.status(401).json({ message: "Unauthorized. Please login again." });
	}
};

module.exports = authUser;
