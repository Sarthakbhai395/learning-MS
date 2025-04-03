import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteCourseByIdMutation, useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseTab() {
  const isPublished = true;
  // const isLoading = false;

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  
  const navigate = useNavigate();
  const params = useParams()
  const courseId = params.courseId
  const [previewThumbnail, setPreviewThumbnail] = useState();
  const [editCourse, { data, isSuccess, error, isLoading }] = useEditCourseMutation();
  const {data:getCourseByIdData,isLoading:getCourseByIdLoading} = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true})
  const [publishCourse,{}] = usePublishCourseMutation()
  const [deleteCourseById,{isLoading:deleteCourseLoading,data:deletData}] = useDeleteCourseByIdMutation()

  // console.log(course)
  useEffect(()=>{
    if(getCourseByIdData?.courses)
      {
      const course = getCourseByIdData?.courses
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail,
      });
      // setPreviewThumbnail(course.courseThumbnail);

      // setInput(course)  // this will also work but it will not update the form fields with the existing data when page is refreshed
      // this is because useEffect runs only when the component mounts and not when the component re-renders. So, the state values are not updated.
      // instead of this, we should use the state hook to update the form fields when the component re-renders.
    }
  },[getCourseByIdData])

  //ye toh input field ke liye hogayi
  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // ye select ke liye banani padegi
  const selectCourseCategory = (value) => {
    setInput({ ...input, category: value });
  };

  //ye course description ke liye banani padegi
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  //get file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    formData.append("courseLevel", input.courseLevel);
  
    // Debugging FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    // API Call
    await editCourse({ formData, courseId });
  };
  
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated sucessfully" || data.message);
    }
    if (error) {
      toast.error("Failed to update course" || error.data.message );
    }
  }, [isSuccess, error]);

  async function publishStatusHandler(action)
  {
    try {
      console.log(action)
      const response = await publishCourse({courseId,action})
      console.log(response)
      if(response.data){
        toast.success(response.data.message);
        // navigate(`/courses/${courseId}`)
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  }

  async function removeCourseHandler(){
    try {
      await deleteCourseById({courseId})
      toast.success(deletData?.message || "Course deleted successfully");
      navigate('/admin/course')
    } catch (error) {
      toast.error("Failed to delete course");
    }
  }


  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin"/>;
  // console.log("get course by id",getCourseByIdData)

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
            <Button disabled={getCourseByIdData?.courses.lectures?.length === 0} variant="outline" onClick={()=> publishStatusHandler(getCourseByIdData?.courses.isPublished ? "false" : "true")}>
            {getCourseByIdData?.courses.isPublished ? "Unpublished" : "Publish"}
          </Button>
          <Button onClick={removeCourseHandler}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={input.courseTitle}
              onChange={handleInputChange}
              name="courseTitle"
              placeholder="Ex. Fullstack Developer"
            />
          </div>
          <div>
            <Label>SubTitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={handleInputChange}
              placeholder="Ex. become a Fullstack Developer"
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCourseCategory} defaultValue={input?.category}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel}   defaultValue={input.courseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={handleInputChange}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="thumbnail"
                className="w-64 my-2 rounded-lg"
              />
            )}
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSaveCourse}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
