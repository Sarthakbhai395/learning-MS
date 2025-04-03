
const mongoose = require("mongoose")

const lectureSchema = new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:[true,"Title is required"]
    },
    videoUrl:{
        type:String,
        // required:[true,"Video URL is required"]
    },
    publicId:{
        type:String
    },
    isPreviewFree:{
        type:Boolean,
    }
},{timestamps:true})

const Lecture = mongoose.model("Lecture",lectureSchema)

module.exports = Lecture
