import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import { pageVariants } from '../../utils/animations';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEvents: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time stats, telemetry, and metrics from the LMS platform.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalStudents}</div>
          <span className="text-[11px] text-slate-400 font-medium">Registered student users</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Active Courses</span>
            <div className="w-9 h-9 rounded-xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalCourses}</div>
          <span className="text-[11px] text-slate-400 font-medium">Courses stored in database</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Live Events</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalEvents}</div>
          <span className="text-[11px] text-slate-400 font-medium">Scheduled interactive streams</span>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-primary-500/5 to-secondary-500/5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-glow">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back to the Control Panel!</h3>
          <p className="text-sm text-slate-500 max-w-xl">
            Use the sidebar menu to create new courses, manage existing events, view registrations, and browse registered students.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
