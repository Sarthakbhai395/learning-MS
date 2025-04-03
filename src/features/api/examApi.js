import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const EXAM_API = "http://localhost:3000/api/v1/exam/";

export const examApi = createApi({
  reducerPath: "examApi",
  tagTypes: ["Refetch_Exams"],
  baseQuery: fetchBaseQuery({ baseUrl: EXAM_API, credentials: "include" }),

  endpoints: (builder) => ({
    // ✅ Create Exam (Only for Instructors)
    createExam: builder.mutation({
      query: ({ title, code, subject, category, timeLimit, totalMarks, numberOfQuestions, examType }) => ({
        url: "",
        method: "POST",
        body: { title, code, subject, category, timeLimit, totalMarks, numberOfQuestions, examType },
      }),
      invalidatesTags: ["Refetch_Exams"],
    }),

    // ✅ Get All Exams
    getAllExams: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Exams"],
    }),

    // ✅ Get Exam by ID
    getExamById: builder.query({
      query: (examId) => ({
        url: `/${examId}`,
        method: "GET",
      }),
    }),

    // ✅ Update Exam (Only for Instructors)
    updateExam: builder.mutation({
      query: ({ examId, formData }) => ({
        url: `/${examId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Exams"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetAllExamsQuery,
  useGetExamByIdQuery,
  useUpdateExamMutation,
} = examApi;
