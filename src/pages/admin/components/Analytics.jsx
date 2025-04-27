// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// // } from "recharts";

// const Analytics = () => {
//   const [analytics, setAnalytics] = useState({
//     revenue: [],
//     userEngagement: [],
//     coursePerformance: [],
//     examResults: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState("month");

//   useEffect(() => {
//     fetchAnalytics();
//   }, [timeRange]);

//   const fetchAnalytics = async () => {
//     try {
//       const response = await fetch(`/api/v1/admin/analytics?range=${timeRange}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setAnalytics(data.analytics);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch analytics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Analytics & Reports</h1>
//         <div className="flex space-x-2">
//           <Button
//             variant={timeRange === "week" ? "default" : "outline"}
//             onClick={() => setTimeRange("week")}
//           >
//             Week
//           </Button>
//           <Button
//             variant={timeRange === "month" ? "default" : "outline"}
//             onClick={() => setTimeRange("month")}
//           >
//             Month
//           </Button>
//           <Button
//             variant={timeRange === "year" ? "default" : "outline"}
//             onClick={() => setTimeRange("year")}
//           >
//             Year
//           </Button>
//         </div>
//       </div>

//       {/* Revenue Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={analytics.revenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#8884d8"
//                   name="Revenue"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* User Engagement Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>User Engagement</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={analytics.userEngagement}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="activeUsers" fill="#82ca9d" name="Active Users" />
//                 <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Course Performance */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Course Performance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={analytics.coursePerformance}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="course" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
//                 <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Exam Results */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Exam Results</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={analytics.examResults}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="exam" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="averageScore"
//                   stroke="#8884d8"
//                   name="Average Score"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="passRate"
//                   stroke="#82ca9d"
//                   name="Pass Rate"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Analytics; 

import React from 'react'

function Analytics() {
  return (
    <div>
      Anaqltics
    </div>
  )
}

export default Analytics
