import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';

// Exam questions data
const examQuestions = {
  'Scholarship Test': [
    { id: 1, question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: "Paris" },
    { id: 2, question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correctAnswer: "William Shakespeare" },
    { id: 3, question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: "Pacific" },
    { id: 4, question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correctAnswer: "Carbon Dioxide" },
    { id: 5, question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correctAnswer: "Leonardo da Vinci" },
    { id: 6, question: "What is 5 x 6?", options: ["25", "30", "35", "40"], correctAnswer: "30" },
    { id: 7, question: "Which country hosted the 2016 Summer Olympics?", options: ["Brazil", "USA", "China", "Russia"], correctAnswer: "Brazil" },
    { id: 8, question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], correctAnswer: "Au" },
    { id: 9, question: "Which planet is known for its rings?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctAnswer: "Saturn" },
    { id: 10, question: "Who is the author of 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "F. Scott Fitzgerald"], correctAnswer: "Harper Lee" },
  ],
  'Mock Test': [
    { id: 1, question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: "4" },
    { id: 2, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars" },
    { id: 3, question: "What is the square root of 16?", options: ["2", "4", "8", "16"], correctAnswer: "4" },
    { id: 4, question: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Lithium", "Oxygen"], correctAnswer: "Hydrogen" },
    { id: 5, question: "Who discovered penicillin?", options: ["Alexander Fleming", "Marie Curie", "Albert Einstein", "Isaac Newton"], correctAnswer: "Alexander Fleming" },
    { id: 6, question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Antarctic", "Arabian"], correctAnswer: "Antarctic" },
    { id: 7, question: "Which sport uses a shuttlecock?", options: ["Tennis", "Badminton", "Squash", "Table Tennis"], correctAnswer: "Badminton" },
    { id: 8, question: "What year did World War II end?", options: ["1945", "1944", "1939", "1950"], correctAnswer: "1945" },
    { id: 9, question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correctAnswer: "Nile" },
    { id: 10, question: "Who painted 'Starry Night'?", options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dali"], correctAnswer: "Vincent van Gogh" },
  ],
  'Replica': [
    { id: 1, question: "What is HTML used for?", options: ["Styling", "Structuring web pages", "Programming", "Database management"], correctAnswer: "Structuring web pages" },
    { id: 2, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Syntax"], correctAnswer: "Cascading Style Sheets" },
    { id: 3, question: "Which tag is used to create a paragraph in HTML?", options: ["<p>", "<div>", "<span>", "<h1>"], correctAnswer: "<p>" },
    { id: 4, question: "What is the purpose of JavaScript?", options: ["Styling", "Adding interactivity", "Database storage", "Server management"], correctAnswer: "Adding interactivity" },
    { id: 5, question: "Which property is used to change the text color in CSS?", options: ["color", "background-color", "font-color", "text-color"], correctAnswer: "color" },
    { id: 6, question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Digital Object Management", "Dynamic Object Mapping"], correctAnswer: "Document Object Model" },
    { id: 7, question: "Which HTML tag is used for images?", options: ["<img>", "<image>", "<pic>", "<figure>"], correctAnswer: "<img>" },
    { id: 8, question: "What is a flexbox used for in CSS?", options: ["Layout design", "Animation", "Font styling", "Color schemes"], correctAnswer: "Layout design" },
    { id: 9, question: "Which event occurs when a user clicks on an element?", options: ["onchange", "onclick", "onload", "onsubmit"], correctAnswer: "onclick" },
    { id: 10, question: "What is the default port for HTTP?", options: ["80", "443", "8080", "21"], correctAnswer: "80" },
  ],
  'Certification Test': [
    { id: 1, question: "What is JavaScript primarily used for?", options: ["Database management", "Web development", "Graphic design", "Server hardware"], correctAnswer: "Web development" },
    { id: 2, question: "Which company developed JavaScript?", options: ["Microsoft", "Netscape", "Google", "Apple"], correctAnswer: "Netscape" },
    { id: 3, question: "What is a closure in JavaScript?", options: ["A loop", "A function with access to its outer scope", "A variable type", "An error handling mechanism"], correctAnswer: "A function with access to its outer scope" },
    { id: 4, question: "Which method is used to add an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: "push()" },
    { id: 5, question: "What does AJAX stand for?", options: ["Asynchronous JavaScript and XML", "Advanced JavaScript and XML", "Asynchronous JSON and XML", "Advanced JSON and XML"], correctAnswer: "Asynchronous JavaScript and XML" },
    { id: 6, question: "Which keyword is used to declare a variable in JavaScript?", options: ["var", "let", "const", "all of the above"], correctAnswer: "all of the above" },
    { id: 7, question: "What is the purpose of the `this` keyword?", options: ["To refer to the current object", "To define a new function", "To loop through arrays", "To handle errors"], correctAnswer: "To refer to the current object" },
    { id: 8, question: "Which HTML attribute is used to specify an inline CSS style?", options: ["class", "id", "style", "src"], correctAnswer: "style" },
    { id: 9, question: "What is the difference between `let` and `var`?", options: ["Scope", "Type", "Value", "Functionality"], correctAnswer: "Scope" },
    { id: 10, question: "Which operator is used for strict equality in JavaScript?", options: ["==", "===", "!=", "!=="], correctAnswer: "===" },
  ],
};

function Exam() {
  const { examId } = useParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const selectedExam = {
      'cert': 'Certification Test',
      'replica': 'Replica',
      'mock': 'Mock Test',
      'practice': 'Scholarship Test',
    }[examId] || 'Certification Test'; // Map examId to exam name
    setQuestions(examQuestions[selectedExam] || []);
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else {
        handleSubmit();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [examId, timeLeft]);

  const handleAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const correct = questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
    const incorrect = questions.length - correct;
    const accuracy = (correct / questions.length) * 100 || 0;
    const timeTaken = 300 - timeLeft;
    const score = (correct / questions.length) * 100 || 0;

    const record = {
      examName: {
        'cert': 'Certification Test',
        'replica': 'Replica',
        'mock': 'Mock Test',
        'practice': 'Scholarship Test',
      }[examId] || 'Certification Test',
      date: new Date(),
      correct,
      incorrect,
      accuracy: accuracy.toFixed(2),
      score: score.toFixed(2),
      timeTaken: `${timeTaken} seconds`,
      sectionResults: [{ section: 'General', accuracy: accuracy.toFixed(2), improvement: 'Review weak areas' }],
    };

    const userId = user ? user._id : 'defaultUser';
    const records = JSON.parse(localStorage.getItem(`examRecords_${userId}`)) || [];
    records.push(record);
    localStorage.setItem(`examRecords_${userId}`, JSON.stringify(records));
    setShowResult(true);
  };

  if (showResult) {
    const correctAnswers = questions.filter((q) => userAnswers[q.id] === q.correctAnswer);
    const incorrectAnswers = questions.filter((q) => userAnswers[q.id] !== q.correctAnswer && userAnswers[q.id] !== undefined);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white w-full max-w-4xl">
          <h3 className="text-2xl font-bold mb-4">Exam Result</h3>
          <p>Correct Answers: {correctAnswers.length}</p>
          <p>Incorrect Answers: {incorrectAnswers.length}</p>
          <p>Accuracy: {((correctAnswers.length / questions.length) * 100).toFixed(2)}%</p>
          <p>Time Taken: {300 - timeLeft} seconds</p>
          <p>Submitted at: {timeLeft > 0 ? 'Manual' : 'Auto (Time Up)'} in {300 - timeLeft} seconds</p>
          <p>Score: {((correctAnswers.length / questions.length) * 100).toFixed(2)}/100</p>

          <div className="mt-4 flex space-x-2">
            <Button
              onClick={() => {
                setShowCorrect(true);
                setShowIncorrect(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              View Correct Answers
            </Button>
            <Button
              onClick={() => {
                setShowIncorrect(true);
                setShowCorrect(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              View Incorrect Answers with Solutions
            </Button>
            <Button
              onClick={() => navigate('/home')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Back to Home
            </Button>
          </div>

          {showCorrect && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Correct Answers:</h4>
              {correctAnswers.map((q, idx) => (
                <div key={idx} className="text-green-300">
                  <p>{q.question}</p>
                  <p>Your Answer: {userAnswers[q.id]}</p>
                  <p>Correct Answer: {q.correctAnswer}</p>
                </div>
              ))}
            </div>
          )}

          {showIncorrect && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Incorrect Answers:</h4>
              {incorrectAnswers.map((q, idx) => (
                <div key={idx} className="text-red-300">
                  <p>{q.question}</p>
                  <p>Your Answer: {userAnswers[q.id] || 'Not answered'}</p>
                  <p>Correct Answer: {q.correctAnswer}</p>
                  <p>Solution: Please review the concept related to {q.question.split(': ')[1]} for the correct answer.</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white w-full max-w-4xl">
        <h3 className="text-2xl font-bold mb-4">Exam: {
          {
            'cert': 'Certification Test',
            'replica': 'Replica',
            'mock': 'Mock Test',
            'practice': 'Scholarship Test',
          }[examId] || 'Certification Test'
        }</h3>
        <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <p>{q.question}</p>
            {q.options.map((option, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleAnswer(q.id, option)}
                  className={`mt-2 ${userAnswers[q.id] === option ? 'bg-blue-500' : 'bg-gray-500'} text-white px-4 py-2 rounded-lg hover:bg-gray-600`}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
        ))}
        <Button
          onClick={handleSubmit}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          disabled={timeLeft === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Exam;