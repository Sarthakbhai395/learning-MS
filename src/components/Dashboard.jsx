// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [examRecords, setExamRecords] = useState([]);
  const [sortBy, setSortBy] = useState('date'); // Default sort by date
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme toggle

  useEffect(() => {
    // Fetch exam records from localStorage
    const userId = localStorage.getItem('userId') || 'defaultUser';
    const records = JSON.parse(localStorage.getItem(`examRecords_${userId}`)) || [];
    setExamRecords(records);
  }, []);

  // Sort records based on the selected criteria
  const sortedRecords = [...examRecords].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date); // Newest first
    } else if (sortBy === 'score') {
      return b.score - a.score; // Highest score first
    } else if (sortBy === 'accuracy') {
      return parseFloat(b.accuracy) - parseFloat(a.accuracy); // Highest accuracy first
    }
    return 0;
  });

  // Clear all exam records
  const handleClearHistory = () => {
    const userId = localStorage.getItem('userId') || 'defaultUser';
    localStorage.removeItem(`examRecords_${userId}`);
    setExamRecords([]);
  };

  // Framer Motion variants for card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'dark' : ''}`} style={{ background: isDarkMode ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #e6f3ff, #f0f8ff)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Theme Toggle Button */}
        <div className="mb-6 text-right">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-lg shadow ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-colors duration-300`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Exam History</h1>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors duration-300 ${isDarkMode ? 'hover:bg-blue-700' : ''}`}
            >
              Back to Home
            </motion.button>
            {examRecords.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearHistory}
                className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors duration-300 ${isDarkMode ? 'hover:bg-red-700' : ''}`}
              >
                Clear History
              </motion.button>
            )}
          </div>
        </div>

        {/* Sorting Options */}
        <div className="mb-6 flex items-center space-x-4">
          <label className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          >
            <option value="date" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}>Date (Newest First)</option>
            <option value="score" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}>Score (Highest First)</option>
            <option value="accuracy" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}>Accuracy (Highest First)</option>
          </select>
        </div>

        {/* Exam Records */}
        {sortedRecords.length === 0 ? (
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No exams taken yet.</p>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {sortedRecords.map((record, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
                  style={{ border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0' }}
                >
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>{record.examName}</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                    Date: {new Date(record.date).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Correct Answers: <span className="font-medium">{record.correct}</span>
                    </p>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Incorrect Answers: <span className="font-medium">{record.incorrect}</span>
                    </p>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Accuracy: <span className="font-medium">{record.accuracy}%</span>
                    </p>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Score: <span className="font-medium">{record.score}/100</span>
                    </p>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time Taken: <span className="font-medium">{record.timeTaken}</span>
                    </p>
                  </div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Section-wise Analysis</h3>
                  {record.sectionResults.map((section, idx) => (
                    <div key={idx} className="mb-3">
                      <p className={`text-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {section.section}: <span className="font-medium">{section.accuracy}% Accuracy</span>
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{section.improvement}</p>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;