// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout Components
import MainLayout from './Layout/MainLayout';

// Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/components/DashboardOverview";
import UserManagement from "./pages/admin/components/UserManagement";
import TrainerVerification from "./pages/admin/components/TrainerVerification";
import CourseModeration from "./pages/admin/components/CourseModeration";
import ExamOversight from "./pages/admin/components/ExamOversight";
import PaymentManagement from "./pages/admin/components/PaymentManagement";
import Analytics from "./pages/admin/components/Analytics";
import Dashboard from './pages/admin/Dashboard'; // Ensure this is used

// Course Management Components
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourse from './pages/admin/course/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import EditLecture from './pages/admin/lecture/EditLecture';

// Student/User Components
import Home from './pages/student/Home';
import HeroSection from './pages/student/HeroSection';
import Courses from './pages/student/Courses';
import EditProfile from './pages/student/EditProfile';
import MyLearning from './pages/student/MyLearning';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SyllabusView from "./pages/student/SyllabusView";
import Syllabus from "./pages/student/Syllabus";
import Contact from "./pages/student/Contact";
import About from './pages/About';

// Auth Components
import { Login } from './pages/Login';
import Register from './pages/Register';

// Exam Components
import ExamForm from './components/ExamForm';
import ExamDashboard from './pages/student/ExamDashboard';
import Exam from './pages/student/Exam';

// Instructor Components
import InstructorDashboard from './pages/instructor/InstructorDashboard';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main Routes with Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<><HeroSection /><Courses /></>} />
              <Route path="/home" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/course-detail/:courseId" element={<CourseDetail />}>
                <Route path="syllabus" element={<SyllabusView />} />
              </Route>
              <Route path="/course-progress/:courseId" element={<CourseProgress />} />
              <Route path="/course/:courseId/syllabus" element={<Syllabus />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/edit-profile" element={
                <PrivateRoute roles={["user", "trainer", "admin"]}>
                  <EditProfile />
                </PrivateRoute>
              } />
              <Route path="/my-learning" element={
                <PrivateRoute roles={["user", "trainer", "admin"]}>
                  <MyLearning />
                </PrivateRoute>
              } />
              <Route path="/exam/:examName" element={
                <PrivateRoute roles={["user", "trainer", "admin"]}>
                  <ExamForm />
                </PrivateRoute>
              } />
              <Route path="/exam-dashboard" element={
                <PrivateRoute roles={["user", "trainer", "admin"]}>
                  <ExamDashboard />
                </PrivateRoute>
              } />
            </Route>

            {/* Instructor Routes */}
            <Route path="/instructor" element={<MainLayout />}>
              <Route path="dashboard" element={
                <PrivateRoute roles={["trainer", "admin"]}>
                  <InstructorDashboard />
                </PrivateRoute>
              } />
              <Route path="dashboard/:courseId" element={
                <PrivateRoute roles={["trainer", "admin"]}>
                  <CourseDetail />
                </PrivateRoute>
              } />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="dashboard" element={<Dashboard />} /> {/* Added this route */}
              <Route path="users" element={<UserManagement />} />
              <Route path="trainers" element={<TrainerVerification />} />
              <Route path="courses" element={<CourseModeration />} />
              <Route path="exams" element={<ExamOversight />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors /> {/* Added props for better UX */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;