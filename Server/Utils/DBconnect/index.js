import mongoose from "mongoose";
import config from "config";

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://m001-majid:m001-mongodb-basics@sandbox.hbdszhd.mongodb.net/Inventory_Management")
        // await mongoose.connect(config.get("DB_URI"));
        console.log("Mongo DB is Connected");

    } catch (error) {
        console.log(error);
    }
}

connectDB();