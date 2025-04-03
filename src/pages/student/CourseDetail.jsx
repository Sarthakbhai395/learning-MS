import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 📌 Course content for multiple courses
  const courseData = {
    "67895802573356816f19c260": {
      courseTitle: "React Development Bootcamp",
      coursePrice: "500",
      description: "Learn React from scratch to advanced level with real-world projects.",
      creator: { name: "John Doe" },
      createdAt: "2025-01-15T10:00:00Z",
      enrolledStudents: [1, 2, 3, 4],
      lectures: [
        { lectureTitle: "Introduction to React", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "State and Props", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "React Hooks", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "Building a Project", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      ],
    },
    "67dd7f2e156dd73e822dfe94": {
      courseTitle: "Next.js API Development",
      coursePrice: "800",
      description: "Master API development using Next.js and Express.",
      creator: { name: "Jane Smith" },
      createdAt: "2025-02-10T10:00:00Z",
      enrolledStudents: [5, 6, 7],
      lectures: [
        { lectureTitle: "Intro to Next.js APIs", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "Building RESTful APIs", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "Middleware & Authentication", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { lectureTitle: "Deployment & Best Practices", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      ],
    },
  };

  // Fetch course data based on courseId or provide a default template for new courses
  const course = courseData[courseId] || {
    courseTitle: "New Course",
    coursePrice: "To Be Decided",
    description: "Course details will be updated soon.",
    creator: { name: "Instructor" },
    createdAt: new Date().toISOString(),
    enrolledStudents: [],
    lectures: [],
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

  return (
    <div className="space-y-5 mt-20">
      {/* Course Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">{course?.creator.name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>

      {/* Course Content & Video */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        {/* Course Content */}
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: course.description }} />

          {/* Course Lectures */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course.lectures.length} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.length > 0 ? (
                course.lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>{true ? <PlayCircle size={14} /> : <Lock size={14} />}</span>
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Course content will be available soon.</p>
              )}
            </CardContent>

            {/* View & Download Syllabus Buttons */}
            <div className="flex justify-between p-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button className="w-full bg-red-500 text-white px-4 py-2" onClick={handleViewSyllabus}>
                  View Syllabus
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button className="w-full bg-red-500 text-white px-4 py-2" onClick={handleDownloadSyllabus}>
                  Download Syllabus
                </Button>
              </motion.div>
            </div>
          </Card>
        </div>

        {/* Course Video & Purchase Section */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              {course.lectures.length > 0 ? (
                <>
                  <div className="w-full aspect-video mb-4">
                    <ReactPlayer width="100%" height="100%" url={course.lectures[0].videoUrl} controls={true} />
                  </div>
                  <h1 className="text-lg font-semibold">{course.lectures[0].lectureTitle}</h1>
                </>
              ) : (
                <p className="text-center text-gray-500">No preview available.</p>
              )}
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">Course Price: {course.coursePrice}</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <BuyCourseButton courseId={courseId} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
