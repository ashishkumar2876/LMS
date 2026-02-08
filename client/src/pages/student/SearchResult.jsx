import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  if (!course) return null;
  
  const courseId = course._id;
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 gap-4 py-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto "
      >
        <img
          src={course.courseThumbnail || "https://via.placeholder.com/400x300"}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 object-cover rounded-xl"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle || "Untitled Course"}</h1>
          <p className="text-sm text-gray-600 ">{course.subTitle || ""}</p>
          <p className="text-sm text-gray-700">Instructor: <span className="font-bold">{course.creator?.name || "Unknown"}</span></p>
          {course.courseLevel && <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge>}
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice || 0}</h1>
      </div>
    </div>
  );
};

export default SearchResult;
