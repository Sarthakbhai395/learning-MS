import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { CheckCircle, Clock } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Course({ course, onMarkAsRead }) {
  // Animation states
  const [isHovered, setIsHovered] = useState(false);
  
  // Default fallback data
  const dummyCourse = {
    _id: "dummy123",
    courseTitle: "Demo Course",
    courseThumbnail: "download.jpg",
    coursePrice: "Free",
    courseLevel: "Beginner",
    progress: 0,
    duration: "6 hours",
    isRead: false,
    description: "This is a sample course description",
    creator: {
      name: "Unknown Instructor",
      photoUrl: "download.jpg",
    },
  };
  
  // API se agar valid course data nahi milta, to dummy use karenge
  const courseData = course && course.courseTitle ? course : dummyCourse;
  
  // Handle mark as read without navigating
  const handleMarkAsRead = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event propagation
    if (onMarkAsRead) {
      onMarkAsRead(courseData._id || courseData.id);
    }
  };

  return (
    <Link to={`/course-detail/${courseData._id}`}>
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background elements */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
        
        <Card className="relative overflow-hidden rounded-lg dark:bg-gray-800/90 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-transparent group-hover:border-purple-300 dark:group-hover:border-purple-800">
          <div className="relative overflow-hidden">
            <img
              src={courseData.courseThumbnail || courseData.image || dummyCourse.courseThumbnail}
              className="w-full h-36 object-cover transform transition-transform duration-700 group-hover:scale-110"
              alt="Course Thumbnail"
            />
            
            {/* Price tag with animated appearance */}
            <div className={`absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg transform transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0 scale-110' : 'opacity-0 translate-x-5 scale-90'}`}>
              {courseData.coursePrice || dummyCourse.coursePrice}
            </div>
            
            {/* Status indicator (read/unread) */}
            <div className="absolute top-3 left-3 bg-white dark:bg-slate-700 rounded-full p-1 shadow-lg transform transition-all duration-500">
              {courseData.isRead ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Clock size={20} className="text-orange-500" />
              )}
            </div>
            
            {/* Animated overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <CardContent className="px-5 py-4 space-y-4 relative z-10">
            {/* Animated highlight bar */}
            <div className={`absolute left-0 top-0 w-1 h-0 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-700 ${isHovered ? 'h-full' : 'h-0'}`}></div>
            
            <h1 className="hover:underline truncate font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {courseData.courseTitle || courseData.title || dummyCourse.courseTitle}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
              {courseData.description || dummyCourse.description}
            </p>
            
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span>{courseData.progress || 0}%</span>
              </div>
              <Progress 
                value={courseData.progress || 0} 
                className="h-2 bg-slate-200 dark:bg-slate-700" 
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                  <Avatar className="relative">
                    <AvatarImage
                      className="w-8 rounded-full transition-all duration-500 group-hover:scale-110"
                      src={courseData.creator?.photoUrl || dummyCourse.creator.photoUrl}
                      alt="Creator Avatar"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="font-medium text-xs transform transition-transform group-hover:translate-x-1 duration-300">
                  {courseData.creator?.name || dummyCourse.creator.name}
                </h1>
              </div>
              
              <Badge className="bg-blue-700 text-white rounded-full py-1 px-2 text-xs text-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                {courseData.courseLevel || dummyCourse.courseLevel}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                <Clock size={14} className="mr-1" />
                {courseData.duration || dummyCourse.duration}
              </span>
              
              <Button 
                variant={courseData.isRead ? "outline" : "default"}
                size="sm"
                onClick={handleMarkAsRead}
                className={courseData.isRead 
                  ? "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                }
              >
                {courseData.isRead ? "Marked as Read" : "Mark as Read"}
              </Button>
            </div>
          </CardContent>
          
          {/* Call-to-action button that appears on hover */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/90 to-purple-600/90 py-3 flex justify-center items-center transform transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <span className="text-white font-medium text-sm">View Course Details</span>
          </div>
        </Card>
      </div>
    </Link>
  );
}

export default Course;