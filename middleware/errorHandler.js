const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError")
        return res.status(400).json({ error: "Malformatted Id" });
    else if (error.name === "ValidationError")
        return res.status(400).json({ error: "Invalid credentials" });
    else if (error.name === "JsonWebTokenError"){
        console.log(error.name);
        return res
        .status(401)
        .json({ error: "Not authorized!!! Please signup or login" });
    }
    else if (error.name === "ZodError")
        return res
            .status(400)
            .json({
                error: `Error in ${error.issues[0].path} : ${error.issues[0].message}`,
            });
    else
        return res
            .status(500)
            .json({ message: error, error: "Something Went Wrong" });
};

module.exports = errorHandler;
