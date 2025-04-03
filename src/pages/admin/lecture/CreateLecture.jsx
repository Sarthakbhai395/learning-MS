import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetAllLecturesQuery,
} from "@/features/api/lectureApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

function CreateLecture() {
  const [lectureTitle, SetLectureTitle] = useState();
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  const {
    data: lectureData,
    isSuccess: lectureIsSuccess,
    isLoading: lectureLoading,
    isError,
    refetch
  } = useGetAllLecturesQuery({ courseId });
  console.log("lecture data is", lectureData);
  async function createLecureHandler() {
    try {
      if(lectureTitle === "") return
     await createLecture({ lectureTitle, courseId });
    } catch (error) {
      console.error("Error creating lecture", error);
    }
  }
  console.log(lectureTitle, courseId);
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Lecture created successfully" || data?.message);
    }
    if (error) {
      toast.error("Failed to create lecture" || error.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="flex flex-col mx-18">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add Lecture, add some basic course details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={lectureTitle}
            onChange={(e) => SetLectureTitle(e.target.value)}
            name="lectureTitle"
            placeholder="Your Course here"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLecureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Lecture Loading...</p>
          ) : isError ? (
            <p>Failed to fetch error.</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lecture available</p>
          ) : (
            lectureData.lectures.map((item,idx)=>{
              return <Lecture key={idx} lecture={item} index={idx} courseId={courseId} />
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
