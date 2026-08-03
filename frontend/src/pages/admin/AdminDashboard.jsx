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

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(todayStr);
  const [regStats, setRegStats] = useState({ courses: 0, events: 0, internships: 0 });
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRegistrationStats();
  }, [startDate, endDate]);

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

  const fetchRegistrationStats = async () => {
    try {
      const res = await api.get(`/admin/registration-stats?startDate=${startDate}&endDate=${endDate}`);
      if (res.data.data) {
        setRegStats(res.data.data);
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

      {/* Registration Overview with date-wise filtering */}
      {(() => {
        const cCount = regStats.courses || 0;
        const eCount = regStats.events || 0;
        const iCount = regStats.internships || 0;
        const totalRegs = cCount + eCount + iCount;

        const cPercent = totalRegs > 0 ? (cCount / totalRegs) * 100 : 0;
        const ePercent = totalRegs > 0 ? (eCount / totalRegs) * 100 : 0;
        const iPercent = totalRegs > 0 ? (iCount / totalRegs) * 100 : 0;

        const circ = 251.327;

        // Segment stroke dasharrays
        const cDash = `${(cPercent / 100) * circ} ${circ}`;
        const eDash = `${(ePercent / 100) * circ} ${circ}`;
        const iDash = `${(iPercent / 100) * circ} ${circ}`;

        // Offsets
        const cOffset = 0;
        const eOffset = -((cPercent / 100) * circ);
        const iOffset = -(((cPercent + ePercent) / 100) * circ);

        const segments = [
          { name: 'Course Enrollments', key: 'courses', color: '#b45309', count: cCount, percent: cPercent, dash: cDash, offset: cOffset },
          { name: 'Live Event Signups', key: 'events', color: '#f59e0b', count: eCount, percent: ePercent, dash: eDash, offset: eOffset },
          { name: 'Internship Submissions', key: 'internships', color: '#10b981', count: iCount, percent: iPercent, dash: iDash, offset: iOffset }
        ];

        return (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Registration Analytics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Date range distribution of course, seminar, and internship registrations.</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">To</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-4">
              {/* Pie Chart */}
              <div className="relative w-36 h-36 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {totalRegs === 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                  )}
                  {totalRegs > 0 && segments.map((seg) => (
                    <circle
                      key={seg.key}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="12"
                      strokeDasharray={seg.dash}
                      strokeDashoffset={seg.offset}
                      className="cursor-pointer transition-all duration-300 hover:stroke-[14]"
                      onMouseEnter={() => setHoveredSegment(seg.key)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Total</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">{totalRegs}</span>
                </div>
              </div>

              {/* Legend list */}
              <div className="space-y-3 flex-1 w-full max-w-sm text-xs font-bold">
                {segments.map((seg) => (
                  <div 
                    key={seg.key}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      hoveredSegment === seg.key 
                        ? 'bg-slate-100 dark:bg-slate-800 scale-[1.01] shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/40'
                    }`}
                    style={{ color: hoveredSegment === seg.key ? seg.color : undefined }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></span>
                      <span>{seg.name}</span>
                    </div>
                    <span>{seg.count} ({Math.round(seg.percent)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}
