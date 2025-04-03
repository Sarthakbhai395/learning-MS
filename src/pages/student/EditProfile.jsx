import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Award, Calendar, BookOpen } from "lucide-react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data, isLoading, refetch, error: fetchError } = useLoadUserQuery();
  const [
    updateUser,
    { isLoading: updateUserIsLoading, isError, error: updateError, isSuccess },
  ] = useUpdateUserMutation();

  // Default user data with fallback values
  const defaultUser = {
    name: "Guest User",
    email: "guest@example.com",
    role: "student",
    photoUrl: "https://via.placeholder.com/150",
    enrolledCourses: [],
    studentId: "STU12345",
    enrollmentDate: new Date().toISOString().split("T")[0], // Current date
    completedCourses: 0,
    badges: [],
  };

  // Merge fetched user data with default values
  const user = { ...defaultUser, ...data?.user };

  useEffect(() => {
    if (fetchError) {
      toast.error("Failed to load user data. Using fallback values.");
    }
  }, [fetchError]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    if (name) formData.append("name", name); // Only append if name is provided
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    
    try {
      const result = await updateUser(formData).unwrap(); // Unwrap to get the result
      if (result) {
        refetch(); // Refresh user data
        toast.success("Profile updated successfully!");
        setName(""); // Clear form
        setProfilePhoto(null);
      }
    } catch (err) {
      toast.error(updateError?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully!");
      setName(""); // Clear form after success
      setProfilePhoto(null);
    }
    if (isError) {
      toast.error(updateError?.data?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, updateError]);

  if (isLoading) return <h1 className="text-center text-xl mt-20">Loading Profile...</h1>;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const courseVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.4 },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg transition-all duration-300">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="font-bold text-3xl text-center text-gray-800 dark:text-gray-100 mb-10 relative"
      >
        PROFILE
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 dark:bg-blue-400 rounded"></span>
      </motion.h1>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="group relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 mb-4 ring-4 ring-blue-500/75 dark:ring-blue-400/75 shadow-md transition-transform duration-300 group-hover:scale-105">
              <AvatarImage
                src={user.photoUrl || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-blue-500 text-white flex items-center justify-center">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {user.role.toUpperCase()}
          </span>
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Name:</span>
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.name}
                </span>
              </h2>
              <h2 className="text-lg mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Email:</span>
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.email}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="text-lg mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Student ID:</span>
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {user.studentId}
                </span>
              </h2>
              <h2 className="text-lg mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Joined:</span>
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {new Date(user.enrollmentDate).toLocaleDateString()}
                </span>
              </h2>
            </div>
          </div>

          {/* Additional Student Details */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Courses Enrolled:</span> {user.enrolledCourses.length}
              </p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-5 w-5 text-yellow-500" />
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Completed Courses:</span> {user.completedCourses}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-500" />
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Badges Earned:</span>{" "}
                {user.badges?.length > 0 ? user.badges.join(", ") : "None yet"}
              </p>
            </div>
          </div>

          {/* Edit Profile Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <motion.div
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
              >
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Profile</DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Update your profile details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-gray-800 dark:text-gray-200">Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter new name"
                      className="col-span-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-gray-800 dark:text-gray-200">Photo</Label>
                    <Input
                      onChange={onChangeHandler}
                      type="file"
                      accept="image/*"
                      className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={updateUserIsLoading}
                    onClick={updateUserHandler}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300"
                  >
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Enrolled Courses Section */}
      <div className="mt-10">
        <h1 className="font-semibold text-2xl text-gray-800 dark:text-gray-100 mb-6 relative inline-block">
          Enrolled Courses
          <span className="absolute bottom-[-5px] left-0 w-12 h-1 bg-blue-500 dark:bg-blue-400 rounded"></span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user.enrolledCourses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 col-span-full text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              You haven't enrolled in any courses yet.
            </p>
          ) : (
            user.enrolledCourses.map((course, idx) => (
              <motion.div
                key={idx}
                variants={courseVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <Course course={course} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;