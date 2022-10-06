import mongoose from "mongoose";
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://abdulrafi_04:Rafi0117@raficfi.zki6qm3.mongodb.net/Inventory_Management")
        console.log("Mongo DB is Connected");
    } catch (error) {
        console.log(error);
    }
}
connectDB();