import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Simulating instructor name
const getInstructorName = () => localStorage.getItem('instructorName') || 'Unknown Instructor';

function Result() {
  const location = useLocation();
  const { correct, total, accuracy, timeTaken } = location.state || {};
  const instructorName = getInstructorName();

  const resultVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
      <motion.div
        variants={resultVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-300">Exam Result</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Correct Answers: {correct} / {total}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Wrong Answers: {total - correct}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Accuracy: {accuracy}%</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Time Taken: {timeTaken} seconds</p>
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Result made by: {instructorName}</p>
        <Button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back
        </Button>
      </motion.div>
    </div>
  );
}

export default Result;