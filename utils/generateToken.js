const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("./config");

const generateToken = (userId, res) => {

    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn: "5d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });
    
    return token;
}

module.exports = generateToken;