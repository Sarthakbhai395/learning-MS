const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: [true, "Course title is required"],
  },
  subTitle: {
    type: String,
    // required: [true, "Sub-title is required"]
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  courseLevel: {
    type: String,
    enum: ["Beginner", "Medium", "Advanced"],
  },
  coursePrice: {
    type: Number,
  },
  courseThumbnail: {
    type: String,
  },
  enrolledStudents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const course = mongoose.model("Course", courseSchema);
module.exports = course;