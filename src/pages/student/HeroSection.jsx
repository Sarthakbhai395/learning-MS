import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Simulating login state (you might use a context or localStorage)
const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

// Sample course data (Replace with API if needed)
const coursesData = [
  "React for Beginners",
  "Advanced JavaScript",
  "Node.js Mastery",
  "Full Stack Development",
  "Data Structures & Algorithms",
];

// Sample exams data
const exams = [
  'Scholarship Test',
  'Mock Test',
  'Replica',
  'Certification Test',
];

function HeroSection() {
  // For animation timing
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  // For login and exams functionality
  const [loggedIn, setLoggedIn] = useState(false);
  const [showExams, setShowExams] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Animation on load
    setIsLoaded(true);

    // Check login status on mount
    setLoggedIn(isLoggedIn());

    // Scroll effect
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = coursesData.filter(course =>
      course.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  // Handle click to select a course
  const handleSelectCourse = (course) => {
    setSearchQuery(course);
    setFilteredCourses([]); // Clear dropdown after selecting
  };

  // Handle exam selection
  const handleExamSelect = (exam) => {
    if (!loggedIn) {
      navigate('/signup'); // Redirect to signup if not logged in (extra safety)
      return;
    }
    setShowExams(false);
    navigate(`/exam/${exam}`); // Navigate to the exam form page
  };

  // Framer Motion variants for the "Give Exams" button
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative overflow-hidden py-24 px-4 text-center min-h-[500px] flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-950">
        {/* Dynamic animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/30 dark:bg-blue-700/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-300/30 dark:bg-purple-700/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300/30 dark:bg-pink-700/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          
          {/* Small floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30 animate-float"
                style={{
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated content */}
      <div 
        className={`max-w-3xl mx-auto relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
      >
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-white text-5xl font-bold mb-6 leading-tight transition-all duration-700 animate-fadeIn"
            style={{ animationDelay: '300ms' }}
          >
            Find the Best Courses for You
          </h1>
          
          <p 
            className="text-gray-200 dark:text-gray-300 text-lg mb-10 max-w-2xl mx-auto transition-all duration-700 animate-fadeIn"
            style={{ animationDelay: '600ms' }}
          >
            Discover, Learn, and Upskill with our wide range of courses
          </p>

          <form 
            className="flex items-center bg-white/10 backdrop-blur-md dark:bg-gray-800/20 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-8 border border-white/20 transition-all hover:shadow-xl animate-fadeIn"
            style={{ animationDelay: '900ms' }}
          >
            <Input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={handleSearch}
              className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-white dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-400 bg-transparent"
            />
            <Button 
              type="button" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-r-full hover:bg-gray-100 transition-colors animate-pulse"
              style={{ animationDuration: '3s' }}
            >
              Search
            </Button>
          </form>

          {/* Display filtered results */}
          {searchQuery && filteredCourses.length > 0 && (
            <div className="bg-white/10 rounded-lg p-4 max-w-xl mx-auto text-white">
              {filteredCourses.map((course, index) => (
                <div 
                  key={index} 
                  className="p-2 border-b border-gray-500 cursor-pointer hover:bg-white/20 transition"
                  onClick={() => handleSelectCourse(course)}
                >
                  {course}
                </div>
              ))}
            </div>
          )}

          {/* Conditionally Render "Give Exams" Button - Only for Logged-In Users */}
          {loggedIn && (
            <>
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={() => setShowExams(!showExams)}
                  className="bg-red-500 border-2 border-red-500 text-white rounded-full px-8 py-3 font-medium hover:bg-red-600 transition-all animate-fadeIn"
                  style={{ animationDelay: '1200ms' }}
                >
                  Give Exams
                </Button>
              </motion.div>

              {/* Exams List with Transition - Only for Logged-In Users */}
              {showExams && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 bg-white/10 backdrop-blur-md dark:bg-gray-800/20 rounded-lg p-4 max-w-xl mx-auto text-white"
                >
                  <h2 className="text-xl font-bold mb-4">Available Exams</h2>
                  <ul>
                    {exams.map((exam, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2 border-b border-gray-500 last:border-b-0 hover:bg-white/20 transition duration-300 cursor-pointer"
                        onClick={() => handleExamSelect(exam)}
                      >
                        {exam}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;