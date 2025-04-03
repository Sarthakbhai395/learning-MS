// src/pages/student/Courses.jsx
import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";
import { usePublishedCourseQuery } from "@/features/api/courseApi";

// Mock data for preview mode when user is not signed in
const mockCourses = [
  {
    id: 1,
    title: "Introduction to React",
    price: "$49",
    description: "Learn the basics of React in this comprehensive course.",
    image: "https://via.placeholder.com/300x20",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    price: "$59",
    description: "Master advanced JavaScript concepts and techniques.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    title: "CSS for Beginners",
    price: "$29",
    description: "Get started with CSS and style your web pages.",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    title: "Node.js Essentials",
    price: "$69",
    description: "Build scalable backend applications with Node.js.",
    image: "https://via.placeholder.com/300x200",
  },
];

function Courses() {
  const { data, isLoading, isSuccess, isError } = usePublishedCourseQuery();

  console.log("Fetched API Data:", { isLoading, isSuccess, isError, data });

  return (
    <div className="bg-gray-200">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-center mb-10 font-bold text-3xl">Our Courses</h2>

        {/* Show loading state */}
        {isLoading && <h1 className="text-center">Loading...</h1>}

        {/* If there's an error (user not signed in), show a demo video */}
        {isError && (
          <div className="space-y-6">
            {/* Demo Video Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Welcome to Our Learning Platform!
              </h3>
              <p className="text-gray-600 mb-4">
                Sign in to access our full range of courses. Watch this demo to
                learn more about online learning.
              </p>
              <div className="relative w-full max-w-3xl mx-auto aspect-video">
                <iframe
                  className="w-full h-full rounded-lg shadow-md"
                  src="https://www.youtube.com/embed/ezbJwaLmOeM"
                  title="Demo Video for Online Courses"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Optional: Keep the preview mode below the video */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockCourses.map((item) => (
                <Course key={item.id} course={item} isPreview={true} />
              ))}
            </div>
          </div>
        )}

        {/* Data aane ke baad hi ye grid dikhe */}
        {isSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.courses?.length > 0 ? (
              data.courses.map((item, idx) => (
                <Course key={idx} course={item} isPreview={false} />
              ))
            ) : (
              <h1 className="text-center col-span-4">No courses found</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-4 shadow-md rounded-lg">
      <Skeleton className="h-[140px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default Courses;