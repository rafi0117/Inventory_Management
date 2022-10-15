import mongoose from "mongoose";

let componentSchema = new mongoose.Schema({
    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null
    }],
    componentName: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    available: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    description: {
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