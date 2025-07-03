const express = require("express");
require("express-async-errors");
const connectDb = require("./db/connectDb");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const {v2: cloudinary} =  require('cloudinary');
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } = require('./utils/config');
const cors = require("cors");

connectDb();

const app = express();
app.use(cors({
    origin: "https://threads-frontend-navy.vercel.app",
    credentials: true,
}));
          
cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET 
});

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser());
app.use(express.static("dist"));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use(errorHandler);

module.exports = app;