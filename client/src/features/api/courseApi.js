import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8000/api/v1/course";
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course","Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getSearchCourse:builder.query({
      query:({searchQuery,categories,sortByPrice})=>{
        //build your query
        let queryString=`/search?query=${encodeURIComponent(searchQuery)}`;

        //append categories
        if(categories && categories.length>0){
          const categoriesString=categories.map(encodeURIComponent).join(",");
          queryString+=`&categories=${categoriesString}`
        }

        //append sort by price
        if(sortByPrice){
          queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`
        }
        return {
          url:queryString,
          method:"GET"
        }
      }
    }),
    getPublishedCourse:builder.query({
      query:()=>({
        url:"/published-courses",
        method:"GET"
      })
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course","Refetch_Lecture"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags:["Refetch_Creator_Course","Refetch_Lecture"],
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
  
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture:builder.mutation({
      query:({lectureTitle,videoInfo,isPreviewFree,courseId,lectureId})=>({
        url:`/${courseId}/lecture/${lectureId}`,
        method:"POST",
        body:{lectureTitle,videoInfo,isPreviewFree}
      }),
      invalidatesTags:["Refetch_Lecture"]
    }),
    removeLecture:builder.mutation({
      query:(lectureId)=>({
        url:`/lecture/${lectureId}`,
        method:"DELETE"
      }),
      invalidatesTags:["Refetch_Lecture"]
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags:["Refetch_Lecture"]
    }),
    publishCourse:builder.mutation({
      query:({courseId,query})=>({
        url:`/${courseId}?publish=${query}`,
        method:"PATCH",
      }),
      invalidatesTags:["Refetch_Creator_Course"],
    })
  }),
});
export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useGetPublishedCourseQuery,
  useGetSearchCourseQuery
} = courseApi;
