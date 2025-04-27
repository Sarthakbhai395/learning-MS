// src/pages/admin/Dashboard.jsx
import { Card, CardHeader } from "@/components/ui/card";
import React, { useState, useEffect } from "react"; // Added useEffect for instructor functionality
import { motion } from "framer-motion";
import SalesDetails from "./SalesDetails";
import UsersDetails from "./UsersDetails";
import { useNavigate, useLocation } from "react-router-dom"; // Added for navigation and location
import { useSelector } from "react-redux";

// Animation variants for the card (admin)
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Container animation for staggered children (admin)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation for the list (instructor)
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

function Dashboard() {
  // Admin state
  const [showSalesDetails, setShowSalesDetails] = useState(false);
  const [showUsersDetails, setShowUsersDetails] = useState(false);

  // Instructor state
  const [courses, setCourses] = useState([]); // List of approved courses
  const [pendingCourses, setPendingCourses] = useState([]); // List of pending courses
  const [newCourse, setNewCourse] = useState({
    title: "",
    price: "",
    status: "Pending",
    videos: [],
    description: "",
  });
  const [alert, setAlert] = useState(null); // For showing alerts

  const navigate = useNavigate();
  const location = useLocation(); // To determine the current path
  const { role } = useSelector((state) => state.auth);

  // Check if user is admin
  useEffect(() => {
    if (role !== "admin") {
      navigate("/login");
    }
  }, [role, navigate]);

  // Determine if we're in admin or instructor view
  const isInstructorView = location.pathname.startsWith("/instructor");

  // Simulate fetching courses for instructor view (replace with API call in a real app)
  useEffect(() => {
    if (isInstructorView) {
      // Mock data for approved courses
      const mockCourses = [
        {
          id: 1,
          title: "Introduction to React",
          price: "$49",
          status: "Approved",
          videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
          description: "Learn the basics of React in this comprehensive course.",
          creator: { name: "John Doe" },
          createdAt: "2025-01-15T10:00:00Z",
        },
      ];
      setCourses(mockCourses);
    }
  }, [isInstructorView]);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const response = await fetch("/api/courses/instructor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user authentication
          },
        });
  
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses); // Update state with instructor's own courses
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      }
    };
  
    fetchInstructorCourses();
  }, []);
  

  // Admin handlers
  const handleSalesClick = () => {
    setShowSalesDetails(true);
    setShowUsersDetails(false);
  };

  const handleUsersClick = () => {
    setShowUsersDetails(true);
    setShowSalesDetails(false);
  };

  const handleBack = () => {
    setShowSalesDetails(false);
    setShowUsersDetails(false);
  };

  // Instructor handlers
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewCourse({ ...newCourse, videos: files.map((file) => file.name) });
  };

  const handleViewDetails = (course) => {
    navigate(`/instructor/dashboard/${course.id}`);
  };

  return (
    <div className={isInstructorView ? "min-h-screen bg-[#1A2526] text-white p-6" : "min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6"}>
      {isInstructorView ? (
        // Instructor View
        <>
          {alert && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md">
              {alert}
              <button onClick={() => setAlert(null)} className="ml-4 text-sm underline">
                Close
              </button>
            </div>
          )}

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
        </>
      ) : (
        // Admin View (original Dashboard.jsx content, unchanged)
        <>
          {showSalesDetails ? (
            <SalesDetails onBack={handleBack} />
          ) : showUsersDetails ? (
            <UsersDetails onBack={handleBack} />
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardVariants}>
                <Card 
                  className="bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg cursor-pointer"
                  onClick={handleSalesClick}
                >
                  <CardHeader className="p-6">
                    <h3 className="text-lg font-semibold text-purple-700">Total Sales</h3>
                    <p className="text-sm text-gray-500 mt-1">Your monthly revenue</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">$24,500</span>
                      <span className="text-sm text-teal-500">+12.5%</span>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card 
                  className="bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg cursor-pointer"
                  onClick={handleUsersClick}
                >
                  <CardHeader className="p-6">
                    <h3 className="text-lg font-semibold text-purple-700">New Users</h3>
                    <p className="text-sm text-gray-500 mt-1">Recent signups</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">1,234</span>
                      <span className="text-sm text-teal-500">+8.2%</span>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;