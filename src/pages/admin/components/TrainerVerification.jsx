import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const TrainerVerification = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch("/api/v1/admin/trainers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers);
      }
    } catch (error) {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerAction = async (trainerId, action) => {
    try {
      const response = await fetch(`/api/v1/admin/trainers/${trainerId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Trainer ${action}ed successfully`);
        fetchTrainers();
      }
    } catch (error) {
      toast.error(`Failed to ${action} trainer`);
    }
  };

  const viewTrainerDetails = (trainer) => {
    setSelectedTrainer(trainer);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trainer Verification</CardTitle>
          <CardDescription>Review and verify trainer applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer._id}>
                  <TableCell>{trainer.name}</TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trainer.status === "verified"
                          ? "default"
                          : trainer.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {trainer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => viewTrainerDetails(trainer)}
                      >
                        View Details
                      </Button>
                      {trainer.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleTrainerAction(trainer._id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleTrainerAction(trainer._id, "reject")}
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

      {/* Trainer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
            <DialogDescription>
              Review trainer's credentials and documents
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Personal Information</h3>
                <p>Name: {selectedTrainer.name}</p>
                <p>Email: {selectedTrainer.email}</p>
                <p>Phone: {selectedTrainer.phone}</p>
              </div>
              <div>
                <h3 className="font-medium">Professional Information</h3>
                <p>Experience: {selectedTrainer.experience} years</p>
                <p>Specialization: {selectedTrainer.specialization}</p>
                <p>Qualifications: {selectedTrainer.qualifications}</p>
              </div>
              <div>
                <h3 className="font-medium">Documents</h3>
                <div className="space-y-2">
                  {selectedTrainer.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>{doc.type}</span>
                      <Button
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        View
                      </Button>
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

export default TrainerVerification; 