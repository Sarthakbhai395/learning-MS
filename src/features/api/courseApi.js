import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:3000/api/v1/course/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({ baseUrl: COURSE_API, credentials: "include" }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    editCourse: builder.mutation({
      query: ({formData,courseId}) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
    }),

    getCourseById:builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      // providesTags: ["Refetch_Creator_Course"],
    }),

    publishCourse: builder.mutation({
      query: ({courseId,action}) => ({
        url: `/${courseId}?publish=${action}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    publishedCourse:builder.query({
      query:()=>({
        url:"/published-course",
        method:"GET",
      })
    }),

    deleteCourseById: builder.mutation({
      query: ({courseId}) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    })


  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseByIdMutation,
  usePublishedCourseQuery
} = courseApi;
