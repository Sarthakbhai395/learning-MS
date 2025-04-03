import { useGetExamByIdQuery } from "@/features/api/examApi";

const ExamDetails = ({ examId }) => {
  const { data, isLoading, error } = useGetExamByIdQuery(examId);

  if (isLoading) return <p>Loading exam details...</p>;
  if (error) return <p>Error: {error.data.message}</p>;

  return (
    <div>
      <h2>{data.exam.title}</h2>
      <p>Code: {data.exam.code}</p>
      <p>Subject: {data.exam.subject}</p>
    </div>
  );
};

export default ExamDetails;
