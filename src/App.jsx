import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './pages/student/HeroSection';
import ExamForm from './components/ExamForm';
import ExamDashboard from './pages/student/ExamDashboard'; // Single import for ExamDashboard
import { Login } from './pages/Login';
import MainLayout from './Layout/MainLayout';
import Courses from './pages/student/Courses';
import EditProfile from './pages/student/EditProfile';
import MyLearning from './pages/student/MyLearning';
import Sidebar from './pages/admin/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourse from './pages/admin/course/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import EditLecture from './pages/admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail'; // For student-facing course details (/course-detail/:courseId)
import CourseProgress from './pages/student/CourseProgress';
import SyllabusView from "./pages/student/SyllabusView"; // ✅ Kept as it is
import Syllabus from "./pages/student/Syllabus"; // ✅ New syllabus route added
import { ThemeProvider } from "@/context/ThemeProvider";
import About from './pages/About';
import Contact from "./pages/student/Contact";
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CourseDetails from './pages/student/CourseDetail'; // For instructor-facing course details (/instructor/dashboard/:courseId)
import Home from './pages/student/Home'; // Adjusted path to match your project structure
import { Toaster } from 'react-hot-toast'; // Import Toaster for toast notifications
import Exam from './pages/student/Exam'; // Import the Exam component

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900">
        <ThemeProvider>
          <Routes>
            {/* Main Routes with Navbar */}
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <>
                    <HeroSection />
                    <Courses />
                  </>
                }
              />
              <Route path="/home" element={<Home />} />
              <Route path="/exam/:examName" element={<ExamForm />} />
              <Route path="/exam-dashboard" element={<ExamDashboard />} /> {/* Updated route */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="course-detail/:courseId" element={<CourseDetail />}>
                <Route path="syllabus" element={<SyllabusView />} />
              </Route>
              <Route path="course-progress/:courseId" element={<CourseProgress />} />
              <Route path="/course/:courseId/syllabus" element={<Syllabus />} />
              {/* Instructor Routes */}
              <Route path="/instructor">
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="dashboard/:courseId" element={<CourseDetails />} />
              </Route>
              {/* Added Exam Route */}
              <Route path="/exam/:examId" element={<Exam />} />
            </Route>
            {/* Admin Routes with Sidebar */}
            <Route path="/admin" element={<Sidebar />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="course" element={<CourseTable />} />
              <Route path="course/create" element={<AddCourse />} />
              <Route path="course/:courseId" element={<EditCourse />} />
              <Route path="course/:courseId/lecture" element={<CreateLecture />} />
              <Route path="course/:courseId/lecture/:lectureId" element={<EditLecture />} />
            </Route>
          </Routes>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;