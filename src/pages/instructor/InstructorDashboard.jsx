// src/pages/instructor/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import CourseDetails from "../student/CourseDetail";

// Animation for the list
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function InstructorDashboard() {
  const [courses, setCourses] = useState([]); // List of approved courses
  const [pendingCourses, setPendingCourses] = useState([]); // List of pending courses
  const [selectedCourse, setSelectedCourse] = useState(null); // For showing course details
  const [newCourse, setNewCourse] = useState({
    title: "",
    price: "",
    status: "Pending",
    videos: [],
    description: "",
  });
  const [alert, setAlert] = useState(null); // For showing alerts

  // Simulate fetching courses (replace with API call in a real app)
  useEffect(() => {
    // Mock data for approved courses
    const mockCourses = [
      {
        id: 1,
        title: "Introduction to React",
        price: "$49",
        status: "Approved",
        videos: ["video1.mp4", "video2.mp4"],
        description: "Learn the basics of React in this comprehensive course.",
      },
    ];
    setCourses(mockCourses);
  }, []);

  // Handle course upload
  const handleUploadCourse = (e) => {
    e.preventDefault();
    const courseWithId = { ...newCourse, id: Date.now() };
    setPendingCourses([...pendingCourses, courseWithId]);

    // Simulate sending request to admin (replace with API call)
    setTimeout(() => {
      // Mock admin response (50% chance of approval for demo)
      const isApproved = Math.random() > 0.5;
      if (isApproved) {
        setCourses([...courses, { ...courseWithId, status: "Approved" }]);
        setPendingCourses(pendingCourses.filter((c) => c.id !== courseWithId.id));
      } else {
        setPendingCourses(pendingCourses.filter((c) => c.id !== courseWithId.id));
        setAlert("Course not uploaded: Admin rejected the request.");
      }
    }, 2000); // Simulate 2-second admin response time

    // Reset form
    setNewCourse({ title: "", price: "", status: "Pending", videos: [], description: "" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Handle file upload for videos
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewCourse({ ...newCourse, videos: files.map((file) => file.name) });
  };

  // Show course details
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  // Go back to the course list
  const handleBack = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-[#1A2526] text-white p-6">
      {alert && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md">
          {alert}
          <button onClick={() => setAlert(null)} className="ml-4 text-sm underline">
            Close
          </button>
        </div>
      )}

      {selectedCourse ? (
        <CourseDetails course={selectedCourse} onBack={handleBack} />
      ) : (
        <div>
          {/* Upload Course Form */}
          <div className="mb-6">
            <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-200">
              Create a new course
            </button>
            <form onSubmit={handleUploadCourse} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-400">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#2A3537] border border-gray-600 rounded-md text-white"
                  placeholder="Course title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Price</label>
                <input
                  type="text"
                  name="price"
                  value={newCourse.price}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#2A3537] border border-gray-600 rounded-md text-white"
                  placeholder="$49"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#2A3537] border border-gray-600 rounded-md text-white"
                  placeholder="Course description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Upload Videos</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="w-full p-2 bg-[#2A3537] border border-gray-600 rounded-md text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200"
              >
                Upload Course
              </button>
            </form>
          </div>

          {/* Course List */}
          <div>
            <h3 className="text-gray-400 mb-4">A list of your recent courses.</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400">
                    <th className="p-2">Price</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <motion.tbody variants={listVariants} initial="hidden" animate="visible">
                  {[...courses, ...pendingCourses].map((course) => (
                    <motion.tr key={course.id} variants={itemVariants} className="border-t border-gray-600">
                      <td className="p-2">{course.price}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            course.status === "Approved" ? "bg-green-500" : "bg-yellow-500"
                          } text-white text-sm`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="p-2">{course.title}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleViewDetails(course)}
                          className="text-teal-400 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;