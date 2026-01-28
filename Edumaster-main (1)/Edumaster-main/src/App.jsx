import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseDetails from './pages/student/CourseDetails';
import LessonViewer from './pages/student/LessonViewer';
import QuizAttempt from './pages/student/QuizAttempt';
import Certificates from './pages/student/Certificates';
import Leaderboard from './pages/student/Leaderboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import MyCourses from './pages/instructor/MyCourses';
import StudentMyCourses from './pages/student/MyCourses';
import StudentProgress from './pages/instructor/StudentProgress';
import InstructorAnalytics from './pages/instructor/Analytics';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import Analytics from './pages/admin/Analytics';
import SystemSettings from './pages/admin/SystemSettings';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetails />} />

            {/* Profile accessible to all authenticated users */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/my-courses" element={<StudentMyCourses />} />
              <Route path="/student/course/:id" element={<CourseDetails />} />
              <Route path="/student/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
              <Route path="/student/quiz/:quizId" element={<QuizAttempt />} />
              <Route path="/student/certificates" element={<Certificates />} />
              <Route path="/student/leaderboard" element={<Leaderboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<MyCourses />} />
              <Route path="/instructor/courses/create" element={<CreateCourse />} />
              <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
              <Route path="/instructor/students" element={<StudentProgress />} />
              <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/courses" element={<CourseManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
