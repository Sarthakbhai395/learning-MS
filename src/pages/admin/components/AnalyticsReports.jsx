import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function AnalyticsReports() {
  const [selectedReport, setSelectedReport] = useState("overview");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Total Courses</h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">₹0</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 