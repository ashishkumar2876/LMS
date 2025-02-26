import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import React, { useDebugValue } from "react";

const Course = () => {
  return (
    <div>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ">
        <div className="relative">
          <img
            src="https://img-c.udemycdn.com/course/750x422/3873464_403c_3.jpg"
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="mt-2 flex flex-col gap-2">
          <h1 className="hover:underline font-bold text-lg truncate text-center">
            Nextjs Complete Course in Hindi
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-md md:text-xs">
                Patel Mernstack
              </h1>
            </div>
            <Badge
              className={
                "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
              }
            >
              Advance
            </Badge>
          </div>
          <div className="text-md font-bold">
            <span className="">₹499</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Course;
