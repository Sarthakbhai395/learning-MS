import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const ExamOversight = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/v1/admin/exams", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setExams(data.exams);
      }
    } catch (error) {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleExamAction = async (examId, action) => {
    try {
      const response = await fetch(`/api/v1/admin/exams/${examId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Exam ${action}ed successfully`);
        fetchExams();
      }
    } catch (error) {
      toast.error(`Failed to ${action} exam`);
    }
  };

  const viewExamDetails = (exam) => {
    setSelectedExam(exam);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Oversight</CardTitle>
          <CardDescription>Monitor and manage exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell>{exam.course.title}</TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.duration} minutes</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        exam.status === "active"
                          ? "default"
                          : exam.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => viewExamDetails(exam)}
                      >
                        View Details
                      </Button>
                      {exam.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleExamAction(exam._id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleExamAction(exam._id, "reject")}
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

      {/* Exam Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
            <DialogDescription>
              Review exam structure and settings
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Exam Information</h3>
                <p>Title: {selectedExam.title}</p>
                <p>Course: {selectedExam.course.title}</p>
                <p>Duration: {selectedExam.duration} minutes</p>
                <p>Passing Score: {selectedExam.passingScore}%</p>
              </div>
              <div>
                <h3 className="font-medium">Anti-Cheating Measures</h3>
                <div className="space-y-2">
                  <p>Randomize Questions: {selectedExam.randomizeQuestions ? "Yes" : "No"}</p>
                  <p>Time Limit: {selectedExam.timeLimit ? "Yes" : "No"}</p>
                  <p>Browser Lock: {selectedExam.browserLock ? "Yes" : "No"}</p>
                  <p>Webcam Monitoring: {selectedExam.webcamMonitoring ? "Yes" : "No"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Questions</h3>
                <div className="space-y-2">
                  {selectedExam.questions?.map((question, index) => (
                    <div key={index} className="border p-2 rounded">
                      <p className="font-medium">Question {index + 1}</p>
                      <p>{question.text}</p>
                      <p>Type: {question.type}</p>
                      <p>Points: {question.points}</p>
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

export default ExamOversight; 