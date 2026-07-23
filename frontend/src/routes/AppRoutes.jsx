import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';

import LandingPage from '../pages/public/LandingPage';
import CourseCatalog from '../pages/public/CourseCatalog';
import CourseDetail from '../pages/public/CourseDetail';
import AboutPage from '../pages/public/AboutPage';
import LiveEventsPage from '../pages/public/LiveEventsPage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import VerifyCertificate from '../pages/public/VerifyCertificate';

import StudentDashboard from '../pages/student/StudentDashboard';
import MyCourses from '../pages/student/MyCourses';
import LearningPlayer from '../pages/student/LearningPlayer';
import StudentProfile from '../pages/student/StudentProfile';
import CommunityBoard from '../pages/student/CommunityBoard';
import Certifications from '../pages/student/Certifications';
import MyEvents from '../pages/student/MyEvents';

import AdminDashboard from '../pages/admin/AdminDashboard';
import CourseManager from '../pages/admin/CourseManager';
import CourseBuilder from '../pages/admin/CourseBuilder';
import StudentManager from '../pages/admin/StudentManager';
import AuditLogsView from '../pages/admin/AuditLogsView';
import PlatformSettings from '../pages/admin/PlatformSettings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/live-events" element={<LiveEventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-certificate/:hash" element={<VerifyCertificate />} />
      </Route>

      {/* Student Portal */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="community" element={<CommunityBoard />} />
        <Route path="certifications" element={<Certifications />} />
      </Route>

      {/* Distraction-Free Learning Player */}
      <Route path="/learning/player/:slug" element={<LearningPlayer />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<CourseManager />} />
        <Route path="courses/builder" element={<CourseBuilder />} />
        <Route path="courses/builder/:id" element={<CourseBuilder />} />
        <Route path="students" element={<StudentManager />} />
        <Route path="audit-logs" element={<AuditLogsView />} />
        <Route path="settings" element={<PlatformSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
