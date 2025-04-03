import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const sampleQuestions = {
  "Scholarship Test": [
    { id: 1, question: "What is React?", options: ["Library", "Framework", "Language", "None"], answer: "Library" },
    { id: 2, question: "What is JSX?", options: ["Syntax", "Component", "Function", "Hook"], answer: "Syntax" },
  ],
  "Mock Test": [
    { id: 1, question: "What is JavaScript?", options: ["Language", "Database", "API", "OS"], answer: "Language" },
    { id: 2, question: "What is ES6?", options: ["Tool", "Version", "Database", "Package"], answer: "Version" },
  ],
};

function ExamPage() {
  const { examName } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (sampleQuestions[examName]) {
      setQuestions(sampleQuestions[examName]);
    }
  }, [examName]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{examName}</h2>
      {questions.length > 0 ? (
        <ul>
          {questions.map((q) => (
            <li key={q.id} className="mb-4">
              <p className="font-medium">{q.question}</p>
              {q.options.map((option, index) => (
                <label key={index} className="block">
                  <input type="radio" name={`q${q.id}`} className="mr-2" />
                  {option}
                </label>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}
      <Button className="mt-4 bg-blue-600 text-white">Submit</Button>
    </div>
  );
}

export default ExamPage;
