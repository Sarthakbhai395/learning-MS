// src/pages/student/SyllabusView.jsx
import React from "react";
import { useParams } from "react-router-dom";

const SyllabusView = () => {
  const { courseId } = useParams();

  // Using the same dummy data as in CourseDetail.js, with corrected typo
  const data = {
    course: {
      courseTitle: "React Development Bootcamp",
      description: "Learn React from scratch to advanced level with real-world projects.lormem",
      creator: { name: "John Doe" },
      coursePrice: "500", // Fixed typo: changed "cousrePrice" to "coursePrice"
      createdAt: "2025-01-15T10:00:00Z",
      enrolledStudents: [1, 2, 3, 4],
      lectures: [
        { lectureTitle: "Introduction to React" },
        { lectureTitle: "State and Props" },
        { lectureTitle: "React Hooks" },
        { lectureTitle: "Building a Project" },
      ],
    },
  };

  const { course } = data;

  // Defensive checks to prevent runtime errors
  if (!course) {
    return <div>Course data not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto my-5 px-4 md:px-8">
      <h1 className="font-bold text-2xl md:text-3xl mb-5">
        Syllabus for {course.courseTitle || "Unknown Course"}
      </h1>
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Course Title: {course.courseTitle || "N/A"}</h2>
        <p className="text-sm">Description: {course.description || "No description available"}</p>
        <p className="text-sm">Created By: {course.creator?.name || "Unknown Creator"}</p>
        <p className="text-sm">Price: ₹{course.coursePrice || "N/A"}</p> {/* Updated to coursePrice */}
        <p className="text-sm">Last Updated: {course.createdAt?.split("T")[0] || "N/A"}</p>
        <p className="text-sm">Students Enrolled: {course.enrolledStudents?.length || 0}</p>
        <h3 className="font-semibold text-md">Lectures:</h3>
        <ul className="list-disc pl-5">
          {course.lectures?.map((lecture, index) => (
            <li key={index}>
              Lecture {index + 1}: {lecture.lectureTitle || "Untitled Lecture"}
            </li>
          )) || <li>No lectures available</li>}
        </ul>
      </div>
    </div>
  );
};

export default SyllabusView;