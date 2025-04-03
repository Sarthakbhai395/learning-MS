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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditCourseMutation } from "@/features/api/courseApi";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/lectureApi";
import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:3000/api/v1/media";

function LectureTab() {
  const [lectureTitle, setLectureTitle] = useState("");
  const [free, setFree] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [uploadVideo, setUploadVideoInfo] = useState(null);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const params = useParams();
  const lectureId = params.lectureId;
  const courseId = params.courseId;

  const [editLecture, { data, isSuccess, isLoading, error }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { isLoading: removeLoading, isSuccess: removeSuccess, data: removeData },
  ] = useRemoveLectureMutation();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);

  const lecture = lectureData?.lecture;
  console.log("lecture tab is", lecture);

  useEffect(()=>{
    if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo)
    }
  },[lecture])


  async function fileChangeHandler(e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData(); // Create an empty FormData
      formData.append("file", file); // Append the file to the formData
      formData.append("lectureId", lectureId); // Append lectureId to the formData
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.publicId,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to upload video");
      } finally {
        setMediaProgress(false);
      }
    }
  }

  async function editLectureHandler() {
    await editLecture({
      courseId,
      lectureId,
      lectureTitle,
      isPreviewFree: free,
      videoInfo: uploadVideo,
    });
  }

  async function deleteHandler() {
    await removeLecture({ lectureId, courseId });
  }

  //for update
  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture updated successfully" || data.message);
    } else if (error) {
      toast.error("Failed to update lecture" || data.message);
    }
  }, [isSuccess, error, data]);

  //for delete
  useEffect(() => {
    if (removeSuccess) {
      toast.success("Lecture removed successfully" || removeData.message);
      // navigate(`/admin/course/${courseId}/lectures`);
    }
  }, [removeSuccess]);

  console.log(free);

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Lecture Details</CardTitle>
            <CardDescription>
              Make changes and click save when done.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={deleteHandler}
              disabled={removeLoading}
            >
              {removeLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  "Please wait"
                </>
              ) : (
                "remove lecture"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Ex. Introduction to Javascript"
            />
          </div>
          <div className="my-5">
            <Label>
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              className="w-fit"
              onChange={fileChangeHandler}
              placeholder="Ex. Introduction to Javascript"
            />
          </div>
          <div className="flex items-center space-x-2 my-5">
            <Switch
              id="airplane-mode"
              checked={free}
              onCheckedChange={setFree}
            />
            <Label htmlFor="airplane-mode">Is This Video Free</Label>
          </div>
          {mediaProgress && (
            <div className="my-4">
              <Progress
                value={uploadProgress}
                onChange={(e) => setFree(e.target.value)}
              />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
          <div className="mt-4">
            <Button onClick={editLectureHandler} disable={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  "Please wait"
                </>
              ) : (
                "Update lecture"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LectureTab;
