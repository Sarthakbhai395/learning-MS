const Lecture = require("../model/lectureModel")
const Course = require("../model/courseModel")
const mongoose = require("mongoose");
const { deleteMedia } = require("../utils/cloudinary");

exports.createLecture = async (req, res) => {
    try {
        const { lectureTitle} = req.body;
        const {courseId } = req.params
        console.log(lectureTitle,courseId)
        if(!lectureTitle || !courseId)
        {
            return res.status(400).json({ success: false, message: "Please provide lectureTitle" })
        }

        //create lecture
        const lecture = await Lecture.create({lectureTitle})

        const course = await Course.findById(courseId)
        console.log(course)
        if(course)
        {
            course.lectures.push(lecture._id)
            await course.save()
        }

        return res.status(201).json({
            success: true,
            message: "Lecture created successfully",
            lecture
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({ success: false, error: error.message, message: "Failed to create lecture" })
    }
}



exports.getAllLecture = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        console.log("Received courseId:", courseId);

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // Query the course and populate lectures
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            lectures: course.lectures,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Server Error",
            message: "Failed to fetch all lectures",
        });
    }
};


exports.editLecture = async(req,res)=>{
    try
    {
        const { lectureTitle,isPreviewFree,videoInfo } = req.body;
        const { lectureId } = req.params
        const {courseId} = req.params
        //validate lectureId
        const lecture = await Lecture.findById(lectureId)
        console.log("1",isPreviewFree)
        if(!lecture)
        {
            return res.status(404).json({ success: false, message: "Lecture not found" })
        }
        console.log("last",lectureTitle,isPreviewFree,videoInfo,courseId,lectureId)
        
        //update lecture details
        if(lectureTitle)
        {
            lecture.lectureTitle = lectureTitle
        }
        if(videoInfo?.videoUrl)
        {
            lecture.videoUrl = videoInfo.videoUrl
        }
        if(videoInfo?.publicId) 
        {
            lecture.publicId = videoInfo.publicId
        }
        if(isPreviewFree)
        {
            lecture.isPreviewFree = isPreviewFree
        }
        await lecture.save()
        
        //Ensure the course still has the lecture id if it was not already added
        const course = await Course.findById(courseId)
        if(course && course.lectures.includes(lecture._id))
        {
            course.lectures.push(lecture._id)
            await course.save()
        }
        return res.status(200).json({ success: true, message: "Lecture updated successfully", lecture })
    }catch(error)
    {
        console.log(error)
        return res.status(500).json({ success: false, error: error.message, message: "Failed to edit lecture" })
    }
}

exports.deleteLecture = async(req,res)=>{
    try
    {
        const { lectureId } = req.params
        const {courseId} = req.params
        //validate lectureId
        console.log("inside lecture",courseId,lectureId)
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture)
        {
            return res.status(404).json({ success: false, message: "Lecture not found" })
        }
       
        // delete lecture from cloudinary
        if(lecture.publicId)
        {
            await deleteMedia(lecture.publicId)
        }

        //remove lecture from course
        const course = await Course.findById(courseId)
        if(course && course.lectures.includes(lecture._id))
        {
            course.lectures.remove(lecture._id)
            await course.save()
        }

        return res.status(200).json({ success: true, message: "Lecture deleted successfully" })
    }catch(error)
    {
        console.log(error)
        return res.status(500).json({ success: false, error: error.message, message: "Failed to delete lecture" })
    }
}

exports.getLectureById = async (req, res) => {
    try {
        const {lectureId} = req.params
        console.log("inside get lecture by id",lectureId)
        const findlecture = await Lecture.findById(lectureId)
        console.log("inside last lecture",findlecture)
        if(!findlecture)
        {
            return res.status(404).json({ success: false, message: "Lecture not found" })
        }
        return res.status(200).json({ success: true, lecture: findlecture })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: error.message, message: "Failed to fetch lecture by title" })
    }
}