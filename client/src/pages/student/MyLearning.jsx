import React from "react";
import Courses from "./Courses";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { Link } from "react-router-dom";

const MyLearning = () => {

  const myLearningCourses = [];
  const {data,isLoading,refetch}=useLoadUserQuery();

  // Refetch user data when component mounts to get latest enrolled courses
  React.useEffect(() => {
    refetch();
  }, []);

  const myLearning=data?.user?.enrolledCourses || [];
  return (
    <div className="max-w-5xl mx-auto my-6 px-4 md:px-0">
      <h1 className="font-bold text-2xl">My Learning</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <p>You are not enrolled in any course</p>
        ) : (
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearning.map((course, index) => (
              
              <Course key={course._id} course={course} />
              
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
        ></div>
      ))}
    </div>
  );
