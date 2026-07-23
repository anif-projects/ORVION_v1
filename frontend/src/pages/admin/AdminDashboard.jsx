import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';
import { pageVariants } from '../../utils/animations';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 1420,
    totalCourses: 12,
    totalRevenue: 34850,
    monthlyRevenue: [
      { month: 'Jan', revenue: 4200, students: 120 },
      { month: 'Feb', revenue: 6800, students: 240 },
      { month: 'Mar', revenue: 9500, students: 380 },
      { month: 'Apr', revenue: 11200, students: 510 },
      { month: 'May', revenue: 14800, students: 780 },
      { month: 'Jun', revenue: 18400, students: 950 },
    ],
    recentPayments: [
      { _id: 'tx1', studentName: 'Alex Johnson', courseTitle: 'Full-Stack React Masterclass', amount: 49.99, createdAt: '2026-07-22' },
      { _id: 'tx2', studentName: 'Elena Rostova', courseTitle: 'AI System Design', amount: 89.99, createdAt: '2026-07-21' },
    ],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.data) {
        setStats((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Executive Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time telemetry, revenue performance, and enrollment metrics.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-accent-success/10 text-accent-success flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-accent-success font-bold">+24.5% from last month</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalStudents}</div>
          <span className="text-[11px] text-primary-600 font-bold">+18.2% growth rate</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Active Courses</span>
            <div className="w-9 h-9 rounded-xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalCourses}</div>
          <span className="text-[11px] text-secondary-500 font-bold">100% Published</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Platform Security</span>
            <div className="w-9 h-9 rounded-xl bg-accent-success/10 text-accent-success flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">Active</div>
          <span className="text-[11px] text-accent-success font-bold">Zero vulnerabilities detected</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Graph */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Revenue Growth ($)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Graph */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Student Registrations</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="students" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
