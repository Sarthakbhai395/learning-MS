import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, BookMarked, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MyLearning() {
  const [isLoading, setIsLoading] = useState(true);
  const [myLearningCourses, setMyLearningCourses] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [overallProgress, setOverallProgress] = useState(0);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/enrolled-courses');
        // const data = await response.json();
        
        // Simulated data for preview
        const data = [
          {
            _id: "1",
            courseTitle: "Introduction to React",
            description: "Learn the fundamentals of React.js with hands-on examples",
            courseThumbnail: "https://your-image-url.com/react.jpg",
            coursePrice: "₹499",
            courseLevel: "Beginner",
            progress: 65,
            duration: "8 hours",
            isRead: false,
            creator: {
              name: "Rahul Sharma",
              photoUrl: "https://your-image-url.com/profile.jpg",
            },
          },
          {
            _id: "2",
            courseTitle: "Advanced JavaScript Patterns",
            description: "Master JS design patterns and advanced concepts",
            courseThumbnail: "https://your-image-url.com/js.jpg",
            coursePrice: "₹799",
            courseLevel: "Advanced",
            progress: 30,
            duration: "12 hours",
            isRead: false,
            creator: {
              name: "Priya Patel",
              photoUrl: "https://your-image-url.com/profile2.jpg",
            },
          },
          {
            _id: "3",
            courseTitle: "Node.js Backend Development",
            description: "Build scalable APIs with Node.js and Express",
            courseThumbnail: "https://your-image-url.com/node.jpg",
            coursePrice: "₹699",
            courseLevel: "Intermediate",
            progress: 100,
            duration: "10 hours",
            isRead: true,
            creator: {
              name: "Amit Kumar",
              photoUrl: "https://your-image-url.com/profile3.jpg",
            },
          },
        ];
        
        setMyLearningCourses(data);
        
        // Calculate overall progress
        const totalProgress = data.reduce((sum, course) => sum + course.progress, 0);
        setOverallProgress(Math.round(totalProgress / data.length));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setIsLoading(false);
      }
    };

    // Simulate API call with timeout
    setTimeout(fetchCourses, 1000);
  }, []);

  // Mark course as read
  const toggleMarkAsRead = (courseId) => {
    setMyLearningCourses(prevCourses =>
      prevCourses.map(course =>
        course._id === courseId
          ? { ...course, isRead: !course.isRead }
          : course
      )
    );
  };

  // Filter courses based on selected option
  const filteredCourses = myLearningCourses.filter(course => {
    if (filterOption === "completed") return course.progress === 100;
    if (filterOption === "in-progress") return course.progress > 0 && course.progress < 100;
    if (filterOption === "not-started") return course.progress === 0;
    if (filterOption === "marked-read") return course.isRead;
    return true; // "all" option
  });

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/30 rounded-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-500 dark:to-purple-500">My Learning</h2>
        
        {!isLoading && myLearningCourses.length > 0 && (
          <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Your Learning Progress</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1">
                    <Progress value={overallProgress} className="h-3" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{overallProgress}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={filterOption} onValueChange={setFilterOption}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter size={16} className="mr-2" />
                      <SelectValue placeholder="Filter Courses" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="marked-read">Marked as Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <SkeletonCard />
      ) : myLearningCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
              <BookOpen size={64} className="text-blue-600 dark:text-blue-400 relative z-10" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-700 dark:text-slate-200">You are not enrolled in any course</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">Start your learning journey by exploring our wide range of courses</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white font-medium px-6 py-2">
            Explore Courses
          </Button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <BookMarked size={48} className="text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-600 dark:text-slate-300">No courses match your filter</p>
          <Button 
            className="mt-4 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            onClick={() => setFilterOption("all")}
          >
            Show All Courses
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Course 
              key={course._id} 
              course={course}
              onMarkAsRead={toggleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  const arr = [1, 2, 3];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {arr.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-36 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-2 w-full mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyLearning;