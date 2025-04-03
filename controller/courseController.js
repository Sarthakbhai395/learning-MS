const course = require("../model/courseModel");
const Lecture = require("../model/lectureModel")
const { deleteMedia, uploadMedia } = require("../utils/cloudinary");

exports.createCourse = async (req, res) => {
  try {
    console.log("create course");
    const { courseTitle, category } = req.body;
    console.log(courseTitle, category);
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide courseTitle and category",
      });
    }
    const Course = await course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Course created successfully", Course });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to create course",
    });
  }
};

exports.getAllAdminCourse = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        course: [],
        success: false,
        message: "No courses found",
      });
    }
    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch all admin courses",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Course ID fetched from request parameters
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const courseThumbnail = req.file;
    console.log(
      "Details",
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseId,
      courseThumbnail
    );
    // Fetch the course by ID

    let existingCourse = await course.findById(courseId); // Variable renamed to 'existingCourse' to avoid conflict with 'course' model

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" }); // Return if the course doesn't exist
    }

    let thumbnail;
    if (courseThumbnail) {
      // Delete old thumbnail if it exists
      if (existingCourse.courseThumbnail) {
        const publicId = existingCourse.courseThumbnail
          .split("/")
          .pop()
          .split(".")[0];
        await deleteMedia(publicId); // Delete old thumbnail from Cloudinary
      }

      // Upload new thumbnail
      const uploadResult = await uploadMedia(courseThumbnail.path);
      thumbnail = uploadResult?.secure_url || uploadResult; // Handle return type of 'uploadMedia'
    }

    // Prepare updated data
    const updatedData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      ...(thumbnail && { courseThumbnail: thumbnail }), // Add courseThumbnail only if it exists
    };

    // Update the course and fetch the updated document
    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      updatedData,
      { new: true }
    ); // Use 'new: true' to get updated data
    return res.status(200).json({
      course: updatedCourse,
      message: "Course updated successfully.", // Success message
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to update course",
    }); // Error response
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const courses = await course.findById(courseId);
    console.log(courses);
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to fetch course",
    });
  }
};

// publish and unPublish course course logic

exports.togglePublishCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { publish } = req.query; // true ,false
    console.log(publish);
    const courses = await course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    //publish status based on the query parameter

    courses.isPublished = publish === "true";
    await courses.save();

    // console.log(courses);
    const messageStatus = courses.isPublished ? "published" : "Unpublished";
    return res
      .status(200)
      .json({ success: true, message: `cousre is ${messageStatus}`, courses });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        error: "Server Error",
        message: "Failed to publish course",
      });
  }
};

exports.publishedCourse = async(_,res)=>{
  try {
    const courses = await course.find({ isPublished: true }).populate({path:"creator",select:"name photoUrl"});
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "No published courses found",
      });
    }
    res.status(200).json({ success: true, courses });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to get published course",
    });
  }
}

exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      console.log("courseId:", courseId);
  
      // Step 1: Check if course exists
      const courses = await course.findById(courseId); // Use the model `course` here
      if (!courses) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
  
      // Step 2: Delete all associated lectures
      if (courses.lectures.length !== 0) {
        const lectureIds = courses.lectures.map((lecture) => lecture._id);
        await Lecture.deleteMany({ _id: { $in: lectureIds } });
        console.log("Lectures deleted successfully");
      }
  
      // Step 3: Delete the course
      await course.findByIdAndDelete(courseId); // Call `findByIdAndDelete` on the model, not the instance
  
      return res.status(200).json({
        success: true,
        message: "Course and associated lectures deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Server Error",
        message: "Failed to delete course and associated lectures",
      });
    }
  };
  