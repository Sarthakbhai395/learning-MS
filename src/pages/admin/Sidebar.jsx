import { ChartNoAxesColumn, SquareLibrary, Home, User, BarChart, Maximize2, PieChart } from "lucide-react"; // Added Maximize2 and PieChart icons
import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import Chart from "chart.js/auto"; // Import Chart.js

const Sidebar = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();
  const [showInstructorInfo, setShowInstructorInfo] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [showAnalyticalData, setShowAnalyticalData] = useState(false);
  const [isChartFullScreen, setIsChartFullScreen] = useState(false);
  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const chartRef = useRef(null);
  const [liveAnalyticalData, setLiveAnalyticalData] = useState({
    lecturesThisWeek: 0,
    syllabusGoal: 0
  });

  // Function to generate random instructor data (simulated)
  const generateRandomInstructorData = () => {
    const adjectives = ["Expert", "Senior", "Lead", "Chief", "Principal"];
    const fields = ["AI", "Data Science", "Machine Learning", "Software Engineering"];
    const institutions = ["MIT", "Stanford", "Harvard", "Caltech"];
    const experiences = ["5+", "8+", "12+", "15+"];

    return {
      title: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${fields[Math.floor(Math.random() * fields.length)]} Instructor`,
      education: `PhD from ${institutions[Math.floor(Math.random() * institutions.length)]}`,
      experience: `${experiences[Math.floor(Math.random() * experiences.length)]} years in research and teaching`,
      bio: "Specialized in cutting-edge technology, with extensive industry and academic experience."
    };
  };

  // Generate random analytical data for the trainer
  const generateAnalyticalData = () => {
    return {
      lecturesThisWeek: Math.floor(Math.random() * 10) + 5, // Random number of lectures (5-14)
      syllabusGoal: Math.floor(Math.random() * 100) + 50 // Random syllabus coverage goal (50-149%)
    };
  };

  const [analyticalData, setAnalyticalData] = useState(generateAnalyticalData());

  // Check system preference and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme) {
      setIsDarkTheme(JSON.parse(savedTheme));
    } else {
      // Check system preference
      setIsDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    // Generate new instructor data on mount
    setInstructorData(generateRandomInstructorData());
    
    // Initial live data
    setLiveAnalyticalData({
      lecturesThisWeek: Math.floor(Math.random() * 10) + 5,
      syllabusGoal: Math.floor(Math.random() * 100) + 50
    });
  }, []);

  // Data fluctuation effect
  useEffect(() => {
    // Only run when analytical data panel is open
    if (!showAnalyticalData) return;

    // Create interval for live data updates
    const dataInterval = setInterval(() => {
      setLiveAnalyticalData(prevData => {
        // Random fluctuation for lectures (±2)
        const newLectures = Math.max(1, prevData.lecturesThisWeek + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
        
        // Random fluctuation for syllabus goal (±5%)
        const newGoal = Math.max(10, Math.min(150, prevData.syllabusGoal + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 6)));
        
        return {
          lecturesThisWeek: newLectures,
          syllabusGoal: newGoal
        };
      });
    }, 1000); // Update every second
    
    // Cleanup interval on unmount or when panel closes
    return () => clearInterval(dataInterval);
  }, [showAnalyticalData]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('darkTheme', !isDarkTheme);
  };

  // Handle home navigation with animation
  const handleGoHome = () => {
    navigate('/');
  };

  // Handle showing instructor info
  const handleShowInstructorInfo = () => {
    setInstructorData(generateRandomInstructorData());
    setShowInstructorInfo(true);
    setShowAnalyticalData(false); // Close analytical data if open
    setIsChartFullScreen(false); // Exit full screen if active
    setClickedDataPoint(null); // Reset clicked data point
  };

  // Handle showing analytical data
  const handleShowAnalyticalData = () => {
    const newData = generateAnalyticalData();
    setAnalyticalData(newData);
    setLiveAnalyticalData(newData); // Initialize live data with generated data
    setShowAnalyticalData(true);
    setShowInstructorInfo(false); // Close instructor info if open
    setClickedDataPoint(null); // Reset clicked data point
  };

  // Close analytical data or instructor info
  const handleCloseData = () => {
    setShowAnalyticalData(false);
    setShowInstructorInfo(false);
    setIsChartFullScreen(false);
    setClickedDataPoint(null);
  };

  // Toggle full screen chart
  const toggleFullScreenChart = () => {
    setIsChartFullScreen(!isChartFullScreen);
    setClickedDataPoint(null); // Reset clicked data point when toggling full screen
  };

  // Chart data using live data
  const chartData = {
    labels: ["Lectures This Week", "Syllabus Goal (%)"],
    datasets: [
      {
        label: "Trainer Metrics",
        data: [liveAnalyticalData.lecturesThisWeek, liveAnalyticalData.syllabusGoal],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Handle chart click to display data point details
  const handleChartClick = (event) => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event.native,
      'nearest',
      { intersect: true },
      false
    );
    
    if (elements.length > 0) {
      const { datasetIndex, index } = elements[0];
      const dataPoint = {
        label: chartData.labels[index],
        value: chartData.datasets[datasetIndex].data[index],
        description: index === 0 
          ? `Total lectures conducted by the trainer this week: ${chartData.datasets[datasetIndex].data[index]}`
          : `Current syllabus coverage goal for this week: ${chartData.datasets[datasetIndex].data[index]}%`
      };
      setClickedDataPoint(dataPoint);
    } else {
      setClickedDataPoint(null);
    }
  };

  // Chart options with click event handling
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Metrics",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Trainer Weekly Performance (Live Data)",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    onClick: handleChartClick,
    animation: {
      duration: 500,
    }
  };

  return (
    <div className={`flex ${isDarkTheme ? 'dark' : ''}`}>
      {/* Theme toggle button - positioned at top right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors transform hover:scale-105"
      >
        {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen bg-white dark:bg-gray-900 relative">
        {/* Go Home button - positioned at top left of sidebar */}
        <button
          onClick={handleGoHome}
          className="absolute top-4 left-4 z-50 bg-blue-500 text-white px-3 py-1 rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 animate-bounce-once flex items-center gap-1"
        >
          <Home size={16} />
          Go Home
        </button>

        <div className="space-y-4 mt-20">
          <Link 
            to="dashboard" 
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors transform hover:scale-105"
          >
            <ChartNoAxesColumn 
              size={22} 
              className={isDarkTheme ? 'text-white' : 'text-gray-800'} 
            />
            <h1 className={isDarkTheme ? 'text-white' : 'text-gray-800'}>
              Dashboard
            </h1>
          </Link>

          <Link 
            to="course" 
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors transform hover:scale-105"
          >
            <SquareLibrary 
              size={22} 
              className={isDarkTheme ? 'text-white' : 'text-gray-800'} 
            />
            <h1 className={isDarkTheme ? 'text-white' : 'text-gray-800'}>
              Courses
            </h1>
          </Link>

          {/* Button for Instructor Info */}
          <button
            onClick={handleShowInstructorInfo}
            className="w-full px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 animate-pulse-once flex items-center gap-1 justify-center"
          >
            <User size={16} />
            View Info
          </button>

          {/* New Analytical Data Button with sparkle effect and new icon */}
          <button
            onClick={handleShowAnalyticalData}
            className="w-full px-2 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-50 transition-opacity"></span>
            <span className="relative flex items-center gap-1 justify-center">
              <PieChart size={16} className="animate-spin-slow" /> {/* New icon with animation */}
              Analytical Data
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 md:p-20 p-2 bg-gray-50 dark:bg-gray-800 relative">
        <Outlet />
        {/* Instructor Info Panel on Right Side */}
        {showInstructorInfo && instructorData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50 animate-slide-in-right">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-l-lg shadow-lg w-1/3 max-w-md ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              <h2 className="text-xl font-bold mb-4">Instructor Profile</h2>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{instructorData.title}</h3>
                <div className="mb-4">
                  {/* Animated Progress Bar as Attractive Element */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Expertise Level</p>
                </div>
                <p className="mt-2"><strong>Education:</strong> {instructorData.education}</p>
                <p className="mt-1"><strong>Experience:</strong> {instructorData.experience}</p>
                <p className="mt-1"><strong>Bio:</strong> {instructorData.bio}</p>
              </div>
              <button
                onClick={handleCloseData}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Analytical Data Panel with Full Screen Chart Option */}
        {showAnalyticalData && !isChartFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50 animate-slide-in-right">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-l-lg shadow-lg w-1/3 max-w-md ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Trainer Analytical Data</h2>
                <button 
                  onClick={toggleFullScreenChart}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
                  title="Full Screen"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  <Bar 
                    data={chartData} 
                    options={chartOptions} 
                    ref={chartRef}
                  />
                  
                  {/* Live Data Values Panel */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg shadow-md transition-all duration-500">
                      <p className="text-center text-lg font-semibold">Lectures</p>
                      <p className="text-center text-2xl font-bold">{liveAnalyticalData.lecturesThisWeek}</p>
                      <div className="mt-2 h-1 bg-blue-200 dark:bg-blue-700">
                        <div className="h-1 bg-blue-500 animate-pulse" style={{width: `${(liveAnalyticalData.lecturesThisWeek/15)*100}%`}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-lg shadow-md transition-all duration-500">
                      <p className="text-center text-lg font-semibold">Syllabus Goal</p>
                      <p className="text-center text-2xl font-bold">{liveAnalyticalData.syllabusGoal}%</p>
                      <div className="mt-2 h-1 bg-pink-200 dark:bg-pink-700">
                        <div className="h-1 bg-pink-500 animate-pulse" style={{width: `${(liveAnalyticalData.syllabusGoal/150)*100}%`}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {clickedDataPoint && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-bold">{clickedDataPoint.label}</h3>
                      <p>{clickedDataPoint.description}</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  This graph shows the number of lectures conducted this week and the syllabus coverage goal for the week.
                  <br /><span className="italic">Click on any bar to see detailed information. Data updates live every second.</span>
                </p>
              </div>
              <button
                onClick={handleCloseData}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Full Screen Chart Panel */}
        {isChartFullScreen && (
          <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                Trainer Analytical Data - Full View (Live)
              </h2>
              <button 
                onClick={toggleFullScreenChart}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
                title="Exit Full Screen"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            
            <div className="flex-1 relative flex flex-col">
              <div className="flex-1">
                <Bar 
                  data={chartData} 
                  options={chartOptions} 
                  ref={chartRef}
                />
              </div>
              
              {/* Live Data Display in Full Screen Mode */}
              <div className="grid grid-cols-2 gap-8 p-4 max-w-4xl mx-auto w-full">
                <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-xl shadow-lg transition-all duration-500">
                  <p className="text-center text-xl font-semibold mb-2">Lectures This Week</p>
                  <p className="text-center text-5xl font-bold mb-4">{liveAnalyticalData.lecturesThisWeek}</p>
                  <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-700 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
                      style={{width: `${(liveAnalyticalData.lecturesThisWeek/15)*100}%`}}
                    ></div>
                  </div>
                  <p className="mt-2 text-center text-sm">
                    {liveAnalyticalData.lecturesThisWeek < 7 ? 'Below Target' : liveAnalyticalData.lecturesThisWeek > 12 ? 'Exceeding Target' : 'On Target'}
                  </p>
                </div>
                
                <div className="bg-pink-100 dark:bg-pink-900 p-6 rounded-xl shadow-lg transition-all duration-500">
                  <p className="text-center text-xl font-semibold mb-2">Syllabus Goal</p>
                  <p className="text-center text-5xl font-bold mb-4">{liveAnalyticalData.syllabusGoal}%</p>
                  <div className="mt-2 h-2 bg-pink-200 dark:bg-pink-700 rounded-full">
                    <div 
                      className="h-2 bg-pink-500 rounded-full transition-all duration-500" 
                      style={{width: `${(liveAnalyticalData.syllabusGoal/150)*100}%`}}
                    ></div>
                  </div>
                  <p className="mt-2 text-center text-sm">
                    {liveAnalyticalData.syllabusGoal < 60 ? 'Below Target' : liveAnalyticalData.syllabusGoal > 100 ? 'Exceeding Target' : 'On Target'}
                  </p>
                </div>
              </div>
              
              {clickedDataPoint && (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg m-4 max-w-md mx-auto">
                  <h3 className="font-bold text-lg">{clickedDataPoint.label}</h3>
                  <p className="text-lg">{clickedDataPoint.description}</p>
                </div>
              )}
              
              <p className={`mt-4 text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                Data updates automatically every second. Click on any bar in the chart to see detailed information.
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCloseData}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;