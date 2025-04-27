import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const CourseModeration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/v1/admin/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (courseId, action) => {
    try {
      const response = await fetch(`/api/v1/admin/courses/${courseId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Course ${action}ed successfully`);
        fetchCourses();
      }
    } catch (error) {
      toast.error(`Failed to ${action} course`);
    }
  };

  const viewCourseDetails = (course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Moderation</CardTitle>
          <CardDescription>Review and approve courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.trainer.name}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "published"
                          ? "default"
                          : course.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => viewCourseDetails(course)}
                      >
                        View Details
                      </Button>
                      {course.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleCourseAction(course._id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCourseAction(course._id, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Course Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              Review course content and details
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Course Information</h3>
                <p>Title: {selectedCourse.title}</p>
                <p>Description: {selectedCourse.description}</p>
                <p>Category: {selectedCourse.category}</p>
                <p>Price: ${selectedCourse.price}</p>
              </div>
              <div>
                <h3 className="font-medium">Trainer Information</h3>
                <p>Name: {selectedCourse.trainer.name}</p>
                <p>Email: {selectedCourse.trainer.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Course Content</h3>
                <div className="space-y-2">
                  {selectedCourse.modules?.map((module, index) => (
                    <div key={index} className="border p-2 rounded">
                      <p className="font-medium">Module {index + 1}: {module.title}</p>
                      <p>Lessons: {module.lessons.length}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseModeration; 