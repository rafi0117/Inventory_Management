import mongoose from "mongoose";
let userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        maxlength: 25,
        minlength: 2,
        required: true
    },
    lastname: {
        type: String,
        maxlength: 25,
        minlength: 2,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    userverified: {
        email: {
            type: Boolean,
            default: false, 
        },
    },
    userverifytoken: {
        email: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user"
    },
    campuslead: {
        type: Boolean,
        required: true
    },
});

const userModel = new mongoose.model("user", userSchema, "user");

export default userModel