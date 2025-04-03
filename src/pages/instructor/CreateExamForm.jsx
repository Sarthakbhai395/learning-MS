import { useState } from "react";
import { useCreateExamMutation } from "@/features/api/examApi";

const CreateExamForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    subject: "",
    category: "",
    timeLimit: "",
    totalMarks: "",
    numberOfQuestions: "",
    examType: "",
  });

  const [createExam, { isLoading, error }] = useCreateExamMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createExam(formData);
    console.log("Exam Created:", response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Exam Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      <input type="text" placeholder="Exam Code" onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
      <button type="submit" disabled={isLoading}>Create Exam</button>
      {error && <p>Error: {error.data.message}</p>}
    </form>
  );
};

export default CreateExamForm;
