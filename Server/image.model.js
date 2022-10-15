import mongoose from "mongoose";

const imageSchema = mongoose.Schema ({
    name : {
        type : String,
        required : true
    },
    image : {
        data : Buffer,
        contentType : String
    }
})

export default mongoose.model("images", imageSchema, "images")