import { useGetAllExamsQuery } from "@/features/api/examApi";


const ExamList = () => {
  const { data, isLoading, error } = useGetAllExamsQuery();

  if (isLoading) return <p>Loading exams...</p>;
  if (error) return <p>Error: {error.data.message}</p>;

  return (
    <ul>
      {data?.exams.map((exam) => (
        <li key={exam._id}>
          {exam.title} - {exam.code}
        </li>
      ))}
    </ul>
  );
};

export default ExamList;
