const mongoose = require("mongoose");
const {MONGO_URI} = require("../utils/config");

const connectDb = async () => {
    try {
        mongoose.set("strictQuery", false);
        const response = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected at ${mongoose.connection.host}`)
    } 
    catch(error) {
        console.log("MongoDB refused to connect: ",error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

module.exports = connectDb;
