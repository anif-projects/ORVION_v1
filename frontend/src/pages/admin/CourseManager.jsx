import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, Copy, Layers, Star, Users, Smartphone, Mail, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Enrolled Students
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses?limit=50&status=all');
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
      setCourses([
        {
          _id: '1',
          title: 'Full-Stack React & Node.js Masterclass',
          slug: 'fullstack-react-nodejs-masterclass',
          price: 89.99,
          status: 'published',
          enrolledCount: 1420,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all associated lessons?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      toast.success('Course deleted!');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await api.patch(`/courses/${id}/toggle-featured`);
      if (res.data.data) {
        toast.success(res.data.data.course.isFeatured ? 'Course set as Featured!' : 'Course removed from Featured!');
        fetchCourses();
      }
    } catch (err) {
      toast.error('Failed to toggle featured status');
    }
  };

  const handleViewStudents = async (courseId, courseTitle) => {
    setSelectedCourseTitle(courseTitle);
    setIsStudentsModalOpen(true);
    setLoadingStudents(true);
    try {
      const res = await api.get(`/courses/${courseId}/students`);
      setEnrolledStudents(res.data.data.students || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load enrolled students');
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Course Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, edit, publish, and view enrolled students for each course.</p>
        </div>

        <Link
          to="/admin/courses/builder"
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow flex items-center gap-2 text-xs hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {/* Courses Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Enrolled</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {courses.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleFeatured(c._id)} 
                      className="p-1 hover:scale-110 transition text-slate-400 focus:outline-none"
                      title={c.isFeatured ? "Unfeature Course" : "Feature Course"}
                    >
                      <Star className={`w-4 h-4 ${c.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    </button>
                    <span>{c.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">₹{c.price}</td>
                <td className="px-6 py-4">{c.enrolledCount || 0}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-success/20 text-accent-success uppercase">
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleViewStudents(c._id, c.title)}
                    className="p-2 text-slate-400 hover:text-secondary-600 transition"
                    title="Enrolled Students"
                  >
                    <Users className="w-4 h-4 inline" />
                  </button>
                  <Link to={`/admin/courses/builder/${c._id}`} className="p-2 text-slate-400 hover:text-primary-600 transition" title="Course Builder">
                    <Layers className="w-4 h-4 inline" />
                  </Link>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-slate-400 hover:text-accent-danger transition" title="Delete Course">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enrolled Students Modal */}
      {isStudentsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setIsStudentsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary-600" /> Enrolled Students
              </h3>
              <p className="text-xs text-slate-500 font-medium">Course: {selectedCourseTitle}</p>
            </div>

            <div className="max-h-[350px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              {loadingStudents ? (
                <div className="text-center py-12 text-slate-500 text-sm">Loading enrolled students...</div>
              ) : enrolledStudents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">No students enrolled in this course yet.</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Phone Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                    {enrolledStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">{student.name}</td>
                        <td className="px-4 py-3 text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {student.phone ? (
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-slate-400" /> {student.phone}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
