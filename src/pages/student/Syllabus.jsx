import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Syllabus = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 📌 Define syllabus data for multiple courses
  const syllabusData = {
    "67895802573356816f19c260": {
      title: "React Development Bootcamp",
      description: "A full-stack React course covering everything from basics to advanced concepts.",
      syllabus: [
        { module: "Introduction to React", topics: ["What is React?", "Virtual DOM", "Setting up React App"] },
        { module: "React Components", topics: ["Class vs Functional Components", "Props & State", "Component Lifecycle"] },
        { module: "Hooks & State Management", topics: ["useState & useEffect", "React Context API", "Redux Toolkit"] },
        { module: "React Router", topics: ["Setting up Routes", "Dynamic Routing", "Nested Routes"] },
        { module: "Final Project", topics: ["Building a Full-Stack App", "Deployment & Best Practices"] },
      ],
    },
    "67dd7f2e156dd73e822dfe94": {
      title: "Next.js API Development",
      description: "Master Node.js and Express for backend development.",
      syllabus: [
        { module: "Introduction to Node.js", topics: ["What is Node.js?", "Event Loop", "NPM Modules"] },
        { module: "Express.js Fundamentals", topics: ["Middleware", "Routing", "RESTful API Design"] },
        { module: "Database with MongoDB", topics: ["Mongoose ODM", "CRUD Operations", "Aggregation Pipelines"] },
        { module: "Authentication & Security", topics: ["JWT Authentication", "OAuth 2.0", "Data Encryption"] },
        { module: "Deploying Node.js", topics: ["Hosting on Heroku", "CI/CD Pipelines", "Scaling Applications"] },
      ],
    },
    "678950b830cb9556008dadaf": {
      title: "Full-Stack Web Development",
      description: "Learn how to build full-stack applications using the MERN stack.",
      syllabus: [
        { module: "Frontend with React", topics: ["React Basics", "State Management", "Component Lifecycle"] },
        { module: "Backend with Node.js & Express", topics: ["Setting up Express Server", "Middleware", "REST APIs"] },
        { module: "Database with MongoDB", topics: ["Mongoose ODM", "CRUD Operations", "Aggregation"] },
        { module: "Authentication & Security", topics: ["JWT Authentication", "OAuth2", "Security Best Practices"] },
        { module: "Deployment & DevOps", topics: ["Docker & Containers", "CI/CD Pipelines", "Hosting on AWS & Vercel"] },
      ],
    },
    "67dad3b6d2f7470e37516c02": {
      title: "Advanced JavaScript & ES6+",
      description: "Deep dive into modern JavaScript concepts and best practices.",
      syllabus: [
        { module: "JavaScript Fundamentals", topics: ["Closures", "Hoisting", "Event Loop"] },
        { module: "ES6+ Features", topics: ["Arrow Functions", "Spread & Rest Operators", "Async/Await"] },
        { module: "Advanced Concepts", topics: ["Prototypes & Inheritance", "Functional Programming", "Design Patterns"] },
        { module: "Testing & Debugging", topics: ["Unit Testing", "Debugging with Chrome DevTools", "Performance Optimization"] },
      ],
    },
    "67dd6f888a5335cf021410d6": {
      title: "Data Structures & Algorithms",
      description: "Master DSA with hands-on coding exercises and problem-solving techniques.",
      syllabus: [
        { module: "Arrays & Strings", topics: ["Two Pointers", "Sliding Window", "Prefix Sum"] },
        { module: "Linked Lists", topics: ["Singly & Doubly Linked List", "Cycle Detection", "Reversal Techniques"] },
        { module: "Trees & Graphs", topics: ["Binary Trees", "DFS & BFS", "Dijkstra’s Algorithm"] },
        { module: "Dynamic Programming", topics: ["Memoization", "Tabulation", "Knapsack Problem"] },
      ],
    },
    "67dfdd43fd6117239fd10501": {
      title: "Cybersecurity & Ethical Hacking",
      description: "Learn the fundamentals of cybersecurity, penetration testing, and ethical hacking.",
      syllabus: [
        { module: "Cybersecurity Basics", topics: ["Cyber Threats", "Network Security", "Malware Analysis"] },
        { module: "Ethical Hacking", topics: ["Penetration Testing", "Reconnaissance", "Exploitation Techniques"] },
        { module: "Web Security", topics: ["SQL Injection", "Cross-Site Scripting (XSS)", "Security Headers"] },
        { module: "Defensive Security", topics: ["Firewalls", "Intrusion Detection", "Security Best Practices"] },
      ],
    },
    "67e0edd4109d99a3f98ec507": {
      title: "Artificial Intelligence & Machine Learning",
      description: "Learn AI/ML fundamentals with Python and TensorFlow.",
      syllabus: [
        { module: "AI & ML Basics", topics: ["What is AI?", "Supervised vs Unsupervised Learning", "ML Workflow"] },
        { module: "Machine Learning Models", topics: ["Regression", "Classification", "Clustering"] },
        { module: "Deep Learning & Neural Networks", topics: ["ANN vs CNN vs RNN", "TensorFlow & PyTorch Basics", "Model Optimization"] },
        { module: "Deploying ML Models", topics: ["Model Deployment", "Cloud-based ML Services", "MLOps"] },
      ],
    },
    "67e12991338bf0bf7f7d7f17": {
      title: "Blockchain & Web3 Development",
      description: "A complete guide to blockchain technology and decentralized applications.",
      syllabus: [
        { module: "Blockchain Basics", topics: ["How Blockchain Works", "Consensus Mechanisms", "Smart Contracts"] },
        { module: "Ethereum & Solidity", topics: ["Solidity Basics", "ERC-20 & ERC-721 Tokens", "DeFi & dApps"] },
        { module: "Web3.js & Metamask", topics: ["Interacting with Smart Contracts", "Building a dApp", "Web3 Security"] },
        { module: "Blockchain Scaling & Future", topics: ["Layer 2 Solutions", "Zero-Knowledge Proofs", "Future Trends"] },
      ],
    },
    "dummy123": {
      title: "UI/UX Design Fundamentals",
      description: "Learn UI/UX principles and design professional web and mobile interfaces.",
      syllabus: [
        { module: "Introduction to UI/UX", topics: ["What is UX?", "Difference Between UI & UX", "User Research"] },
        { module: "Wireframing & Prototyping", topics: ["Low-Fidelity Wireframes", "High-Fidelity Prototypes", "Figma & Adobe XD"] },
        { module: "Visual Design Principles", topics: ["Color Theory", "Typography", "Accessibility in Design"] },
        { module: "User Testing & Feedback", topics: ["A/B Testing", "Heatmaps", "Iterative Design Process"] },
      ],
    },
  };

  // 📌 Fetch the syllabus based on the courseId
  const course = syllabusData[courseId] || { title: "Unknown Course", description: "No syllabus available.", syllabus: [] };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto my-10 px-4 md:px-8"
    >
      <h1 className="text-3xl font-bold mb-5 text-gray-800 dark:text-white">{course.title} - Syllabus</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>

      <motion.div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg shadow-md">
        {course.syllabus.length > 0 ? (
          <ul className="space-y-6">{course.syllabus.map((module, index) => (
            <li key={index}><h2 className="text-xl font-semibold">{module.module}</h2></li>
          ))}</ul>
        ) : <p>No syllabus available.</p>}
      </motion.div>

      <Button className="mt-6 bg-red-500" onClick={() => navigate(-1)}>Go Back</Button>
    </motion.div>
  );
};

export default Syllabus;
