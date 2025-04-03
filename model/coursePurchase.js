const mongoose = require("mongoose")


const purchaseCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type:Number,
        required: true
    },
    paymentId:{
        type: String,
        required: true
    },
    status:{
        type:String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
},{timestamps:true})

const PurchaseCourse = mongoose.model("PurchaseCourse", purchaseCourseSchema)
module.exports = PurchaseCourse