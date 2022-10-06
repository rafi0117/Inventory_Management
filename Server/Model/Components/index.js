import mongoose from "mongoose";
let componentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        unique: true,
        required: true
    },
    Quantity: {
        type: String,
        required: true,
    },
    coverImagrUrl: {
        type: String,
        required: true,
    },
    Source: {
        type: String,
        required: true,
    },
    synopsis: {
        type: String,
        required: true,
    },
    buyingPrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    }
});
export default mongoose.model("components", componentSchema, "components");