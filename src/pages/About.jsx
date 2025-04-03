import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Our LMS</h1>
        <p className="text-lg max-w-2xl mx-auto">
          A modern Learning Management System designed to enhance online learning experiences for students and educators.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-10 space-y-12">
        {/* Overview Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-3">📘 About Our LMS</h2>
          <p className="text-gray-700 leading-relaxed">
            Our LMS provides an efficient and interactive way for students to enroll in courses, track progress, and engage with instructors.
            Whether you're a student looking for quality learning resources or an instructor wanting to share knowledge, we’ve got you covered.
          </p>
        </motion.div>

        {/* Key Features */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-3">🚀 Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>📚 Wide range of courses with expert instructors.</li>
            <li>🎥 Interactive video lectures and study materials.</li>
            <li>📝 Real-time progress tracking and course completion certificates.</li>
            <li>💬 Discussion forums and Q&A sections for better engagement.</li>
            <li>📊 Admin dashboard for managing courses and students.</li>
          </ul>
        </motion.div>

        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-3">🎯 Why Choose Our LMS?</h2>
          <p className="text-gray-700">
            Our Learning Management System is designed to make online learning seamless and effective. 
            Whether you are a beginner or an advanced learner, our platform ensures quality education at your convenience.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-3">📞 Contact Us</h2>
          <p className="text-gray-700">
            Have questions or need support? Reach out to us at:
          </p>
          <ul className="mt-3 text-gray-700">
            <li>📧 Email: <a href="mailto:support@lms.com" className="text-blue-500 hover:underline">support@lms.com</a></li>
            <li>📍 Address: 123 LMS Street, Education City</li>
            <li>📱 Phone: +1 234 567 890</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
