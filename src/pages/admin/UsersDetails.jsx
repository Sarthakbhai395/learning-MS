// src/pages/admin/UsersDetails.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, BookOpen, Clock, Award, BarChart2 } from "lucide-react";

// Animation for the details view
const detailsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

function UsersDetails({ onBack, userData = sampleUserData }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <motion.div
      variants={detailsVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-white/90 shadow-md rounded-lg">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                {userData.photoUrl ? (
                  <img 
                    src={userData.photoUrl} 
                    alt={userData.name} 
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-purple-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-700">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${
                    userData.role === 'instructor' ? 'bg-amber-500' : 'bg-blue-500'
                  } text-white`}>
                    {userData.role === 'instructor' ? 'Instructor' : 'User'}
                  </Badge>
                  <span className="text-xs text-gray-500">Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200"
            >
              Back
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="knowledge">lMS Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-2">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Enrolled Courses</p>
                      <p className="text-xl font-bold text-blue-600">{userData.enrolledCourses.length}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Award size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-xl font-bold text-green-600">
                        {userData.enrolledCourses.filter(course => course.completed).length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-3">User Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{userData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="courses">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Enrolled Courses</h3>
              {userData.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {userData.enrolledCourses.map((enrolledCourse, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-purple-700">{enrolledCourse.course.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Enrolled on: {new Date(enrolledCourse.enrolledOn).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            enrolledCourse.completed ? 'bg-green-500' : 'bg-amber-500'
                          } text-white`}>
                            {enrolledCourse.completed ? 'Completed' : 'In Progress'}
                          </Badge>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{width: `${enrolledCourse.progress}%`}}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{enrolledCourse.progress}% complete</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No courses enrolled yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="activity">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Activity</h3>
              <div className="space-y-4">
                {userData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-gray-100">
                    <div className="p-2 bg-purple-100 rounded-lg h-fit">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Knowledge Management Dashboard</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <BookOpen size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Knowledge Articles</p>
                      <p className="text-xl font-bold text-indigo-600">{userData.kms.articlesCreated}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-rose-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-100 rounded-lg">
                      <BarChart2 size={20} className="text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Knowledge Score</p>
                      <p className="text-xl font-bold text-rose-600">{userData.kms.knowledgeScore}/100</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">Knowledge Contributions</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="space-y-3">
                  {userData.kms.contributions.map((contribution, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-purple-700">{contribution.title}</p>
                        <p className="text-xs text-gray-500">{contribution.date}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-600">{contribution.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">Knowledge Areas</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  {userData.kms.knowledgeAreas.map((area, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{area.name}</span>
                        <span className="text-sm text-gray-500">{area.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{width: `${area.level}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Sample user data with KMS features
const sampleUserData = {
  name: "",
  email: "",
  role: "instructor",
  photoUrl: "",
  joinedDate: "",
  enrolledCourses: [
    {
      course: {
        title: "Advanced React Development",
        id: "course-123"
      },
      enrolledOn: "2023-06-01",
      progress: 75,
      completed: false
    },
    {
      course: {
        title: "Node.js Backend Mastery",
        id: "course-124"
      },
      enrolledOn: "2023-05-20",
      progress: 100,
      completed: true
    },
    {
      course: {
        title: "Database Design Principles",
        id: "course-125"
      },
      enrolledOn: "2023-07-10",
      progress: 45,
      completed: false
    }
  ],
  recentActivity: [
    {
      action: "Completed lesson: API Authentication",
      date: "Yesterday at 2:30 PM",
      details: "Node.js Backend Mastery"
    },
    {
      action: "Submitted assignment",
      date: "Aug 15, 2023",
      details: "React Hooks Implementation"
    },
    {
      action: "Started new course",
      date: "Aug 10, 2023",
      details: "Database Design Principles"
    },
    {
      action: "Earned certificate",
      date: "Aug 05, 2023",
      details: "Node.js Backend Mastery"
    }
  ],
  kms: {
    articlesCreated: 15,
    knowledgeScore: 78,
    contributions: [
      {
        title: "Understanding React Hooks",
        date: "Aug 12, 2023",
        category: "Frontend"
      },
      {
        title: "NoSQL vs SQL Databases",
        date: "July 28, 2023",
        category: "Database"
      },
      {
        title: "JWT Authentication Best Practices",
        date: "July 15, 2023",
        category: "Security"
      }
    ],
    knowledgeAreas: [
      { name: "Frontend Development", level: 85 },
      { name: "Backend Development", level: 70 },
      { name: "Database Management", level: 65 },
      { name: "DevOps", level: 45 },
      { name: "UI/UX Design", level: 60 }
    ]
  }
};

export default UsersDetails;