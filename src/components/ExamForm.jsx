import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Simulating login state
const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

function ExamForm() {
  const { examName } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check login status on mount
    const userLoggedIn = isLoggedIn();
    setLoggedIn(userLoggedIn);

    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/exams/${examName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExam(response.data.exam);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exam:', error);
        setError(error.response?.data?.message || 'Failed to fetch exam');
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchExam();
    setStartTime(Date.now());
  }, [examName, navigate]);

  // Timer for the exam
  useEffect(() => {
    if (!loggedIn || !exam) return;

    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults, loggedIn, exam]);

  const handleAnswerSelect = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const submitExamToServer = async (resultData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/exams/${exam._id}/submit`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error submitting exam:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSubmit = async () => {
    if (!loggedIn || !exam) {
      navigate('/login');
      return;
    }

    let correct = 0;
    const sectionScores = {};

    // Initialize section scores
    exam.questions.forEach((q) => {
      if (!sectionScores[q.section]) {
        sectionScores[q.section] = { correct: 0, total: 0 };
      }
      sectionScores[q.section].total += 1;
    });

    // Calculate results
    exam.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct += 1;
        sectionScores[q.section].correct += 1;
      }
    });

    const totalQuestions = exam.questions.length;
    const incorrect = totalQuestions - correct;
    const accuracy = (correct / totalQuestions) * 100;
    const score = correct * 10;
    const timeTaken = (10 * 60 - timeLeft);

    // Calculate section-wise accuracy and improvement suggestions
    const sectionResults = Object.keys(sectionScores).map((section) => {
      const { correct, total } = sectionScores[section];
      const sectionAccuracy = (correct / total) * 100;
      let improvement = '';
      if (sectionAccuracy < 50) {
        improvement = `Focus on ${section}: Your accuracy is low. Practice more questions in this area.`;
      } else if (sectionAccuracy < 80) {
        improvement = `Improve in ${section}: You're doing okay, but there's room for growth. Review concepts and try more practice.`;
      } else {
        improvement = `Great job in ${section}! Keep maintaining your performance.`;
      }
      return {
        section,
        accuracy: sectionAccuracy.toFixed(2),
        improvement,
      };
    });

    const result = {
      correct,
      incorrect,
      accuracy: accuracy.toFixed(2),
      score,
      timeTaken: formatTime(timeTaken),
      sectionResults,
    };

    // Save to server
    await submitExamToServer(result);

    // Save to local storage (optional)
    const userId = localStorage.getItem('userId') || 'defaultUser';
    const existingRecords = JSON.parse(localStorage.getItem(`examRecords_${userId}`)) || [];
    const newRecord = {
      examName,
      ...result,
      date: new Date().toISOString(),
    };
    existingRecords.push(newRecord);
    localStorage.setItem(`examRecords_${userId}`, JSON.stringify(existingRecords));

    setResults(result);
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!loggedIn) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading exam...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Exam not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="exam"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <h2 className="text-white text-3xl font-bold mb-6">{exam.name}</h2>
            <div className="text-white text-lg mb-4">
              Time Left: {formatTime(timeLeft)}
            </div>
            <div className="bg-white/10 backdrop-blur-md dark:bg-gray-800/20 rounded-lg p-6 text-white">
              {exam.questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-6"
                >
                  <p className="text-lg font-semibold mb-2">{q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((option, optIndex) => (
                      <motion.button
                        key={optIndex}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswerSelect(index, option)}
                        className={`p-2 rounded-lg border border-gray-500 transition duration-300 ${
                          answers[index] === option
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="mt-4 bg-white text-indigo-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Submit
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <h2 className="text-white text-3xl font-bold mb-6">{exam.name} Results</h2>
            <div className="bg-white/10 backdrop-blur-md dark:bg-gray-800/20 rounded-lg p-6 text-white">
              <p className="text-lg mb-2">Correct Answers: {results.correct}</p>
              <p className="text-lg mb-2">Incorrect Answers: {results.incorrect}</p>
              <p className="text-lg mb-2">Overall Accuracy: {results.accuracy}%</p>
              <p className="text-lg mb-2">Score: {results.score}/100</p>
              <p className="text-lg mb-4">Time Taken: {results.timeTaken}</p>
              <h3 className="text-xl font-semibold mb-2">Section-wise Analysis</h3>
              {results.sectionResults.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-4"
                >
                  <p className="text-lg">
                    {section.section}: {section.accuracy}% Accuracy
                  </p>
                  <p className="text-sm text-gray-300">{section.improvement}</p>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-white text-indigo-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Back to Home
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExamForm;