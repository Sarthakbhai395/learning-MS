import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "./CourseDetail.css"; // Import the CSS file

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCourse(response.data.course);
      setPurchased(response.data.purchased);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handlePurchase = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/courses/purchase",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { orderId, order } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "E-Learning",
        description: `Purchase of ${course?.courseTitle || "Course"}`,
        order_id: orderId,
        handler: async (response) => {
          await fetchCourseDetails();
          alert("Payment successful! You have purchased the course.");
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#ff6200",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating purchase:", error);
      alert("Failed to initiate purchase. Please try again.");
    }
  };

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  const handleViewSyllabus = () => {
    navigate(`/course/${courseId}/syllabus`);
  };

  const handleDownloadSyllabus = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Course Syllabus", 20, 20);
    doc.setFontSize(14);
    doc.text(`Course Title: ${course?.courseTitle || "N/A"}`, 20, 30);
    doc.text("Lectures:", 20, 40);

    course?.lectures.forEach((lecture, index) => {
      doc.text(`Lecture ${index + 1}: ${lecture.lectureTitle}`, 30, 50 + index * 10);
    });

    doc.save(`${course?.courseTitle || "course"}-syllabus.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-5 mt-20">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">Course Sub-title</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt?.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchased ? (
                <div className="lecture-grid">
                  {course.lectures.map((lecture, index) => (
                    <div key={lecture._id || index} className="lecture-card">
                      <h3>Lecture {index + 1}: {lecture.lectureTitle}</h3>
                      <ReactPlayer
                        width="100%"
                        height="150px"
                        url={lecture.videoUrl}
                        controls={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                course.lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>
                      {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                    </span>
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))
              )}
            </CardContent>
            {/* Added View Syllabus and Download Syllabus buttons */}
            <div className="flex justify-between p-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleViewSyllabus} className="w-full mr-2 red-button">
                  View Syllabus
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleDownloadSyllabus} className="w-full ml-2 red-button">
                  Download Syllabus
                </Button>
              </motion.div>
            </div>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height={"100%"}
                  url={course.lectures[0].videoUrl}
                  controls={true}
                />
              </div>
              <h1>{course.lectures[0].lectureTitle}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                Course Price: ₹{course.coursePrice}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} onPurchase={handlePurchase} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;