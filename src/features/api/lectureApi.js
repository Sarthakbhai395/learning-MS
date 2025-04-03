
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LECTURE_API = "http://localhost:3000/api/v1/lecture/";

export const lectureApi = createApi({
  reducerPath: "lectureApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({ baseUrl: LECTURE_API, credentials: "include" }),

  endpoints: (builder) => ({
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),

    getAllLectures: builder.query({
      query: ({ courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    editLecture: builder.mutation({
      query: ({lectureTitle,isPreviewFree,videoInfo, lectureId, courseId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, isPreviewFree, videoInfo },
      }),
    }),

    removeLecture:builder.mutation({
      query: ({ lectureId , courseId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags:["Refetch_Creator_Course"]
    }),

    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,  // Make sure only one '/lecture' is used here
        method: "GET",
      }),
      invalidatesTags:["Refetch_Creator_Course"]
    }),


  }),
});

export const { useCreateLectureMutation, useGetAllLecturesQuery , useEditLectureMutation , useRemoveLectureMutation , useGetLectureByIdQuery } = lectureApi;
