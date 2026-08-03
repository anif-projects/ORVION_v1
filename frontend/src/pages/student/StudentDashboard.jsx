import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Award, 
  Flame, 
  BookOpen, 
  ArrowRight, 
  X, 
  Settings, 
  User, 
  Phone, 
  Save, 
  Calendar, 
  Mail, 
  GraduationCap 
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

// Study Time Tracker component with SVG Doughnut (Pie) Chart showing daily spent time
function StudyTimeTracker({ studyStats, setStudyStats }) {
  const [seconds, setSeconds] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const secondsRef = useRef(0);
  const lastLoggedRef = useRef(0);

  // Sync session seconds to DB periodically (every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);

      const delta = secondsRef.current - lastLoggedRef.current;
      if (delta >= 10) {
        lastLoggedRef.current = secondsRef.current;
        api.post('/auth/study-time', { seconds: delta })
          .then(res => {
            if (res.data.status === 'success') {
              setStudyStats(res.data.data);
            }
          })
          .catch(err => console.error('Failed to sync study time:', err));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      const finalDelta = secondsRef.current - lastLoggedRef.current;
      if (finalDelta > 0) {
        api.post('/auth/study-time', { seconds: finalDelta })
          .then(res => {
            if (res.data.status === 'success') {
              setStudyStats(res.data.data);
            }
          })
          .catch(e => console.error(e));
      }
    };
  }, [setStudyStats]);

  const formatSessionTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const monTime = studyStats.study_mon || 0;
  const tueTime = studyStats.study_tue || 0;
  const wedTime = studyStats.study_wed || 0;
  const thuTime = studyStats.study_thu || 0;
  const friTime = studyStats.study_fri || 0;
  const satTime = studyStats.study_sat || 0;
  const sunTime = studyStats.study_sun || 0;

  const totalMinutes = monTime + tueTime + wedTime + thuTime + friTime + satTime + sunTime;

  // Monday to Sunday ordered list with dayIndex (0 = Sunday, 1 = Monday, etc.)
  const orderedDays = [
    { name: 'Monday', key: 'mon', color: '#b45309', val: monTime, dayIndex: 1 },
    { name: 'Tuesday', key: 'tue', color: '#d97706', val: tueTime, dayIndex: 2 },
    { name: 'Wednesday', key: 'wed', color: '#10b981', val: wedTime, dayIndex: 3 },
    { name: 'Thursday', key: 'thu', color: '#3b82f6', val: thuTime, dayIndex: 4 },
    { name: 'Friday', key: 'fri', color: '#8b5cf6', val: friTime, dayIndex: 5 },
    { name: 'Saturday', key: 'sat', color: '#6366f1', val: satTime, dayIndex: 6 },
    { name: 'Sunday', key: 'sun', color: '#ec4899', val: sunTime, dayIndex: 0 },
  ];

  const currentDayIndex = new Date().getDay();
  const circ = 251.327;
  let accumulatedPercent = 0;

  const daysWithLayout = orderedDays.map(day => {
    const percent = totalMinutes > 0 ? (day.val / totalMinutes) * 100 : 0;
    const dash = `${(percent / 100) * circ} ${circ}`;
    const offset = -((accumulatedPercent / 100) * circ);
    accumulatedPercent += percent;
    return {
      ...day,
      percent,
      dash,
      offset,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Study Time Tracker
        </h4>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full text-emerald-600 dark:text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* SVG Doughnut Chart Wrapper */}
        <div className="flex items-center justify-center">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {totalMinutes === 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
              )}
              {daysWithLayout.map((day) => (
                <circle
                  key={day.key}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={day.color}
                  strokeWidth="10"
                  strokeDasharray={day.dash}
                  strokeDashoffset={day.offset}
                  className="cursor-pointer transition-all duration-300 hover:stroke-[12]"
                  onMouseEnter={() => setHoveredSegment(day.key)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Total</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{Math.round(totalMinutes)}m</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs font-bold">
          {daysWithLayout.map((day) => {
            const isToday = currentDayIndex === day.dayIndex;
            return (
              <div 
                key={day.key}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                  hoveredSegment === day.key 
                    ? 'bg-slate-100 dark:bg-slate-800 shadow-sm scale-[1.01]' 
                    : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40'
                }`}
                style={{ color: hoveredSegment === day.key ? day.color : undefined }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: day.color }}></span>
                  <span>{day.name}{isToday ? ' (Today)' : ''}</span>
                </div>
                <span>{Math.round(day.val)}m ({Math.round(day.percent)}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Session Duration</span>
        <span className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {formatSessionTime(seconds)}
        </span>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, setUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certsCount, setCertsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Study stats from user database record
  const [studyStats, setStudyStats] = useState({
    study_mon: 0,
    study_tue: 0,
    study_wed: 0,
    study_thu: 0,
    study_fri: 0,
    study_sat: 0,
    study_sun: 0,
  });
  
  // Dashboard quick profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [learningRes, certsRes, eventsRes, profileRes] = await Promise.all([
        api.get('/learning/my-courses'),
        api.get('/certificates/my-certificates').catch(() => ({ data: { data: { certificates: [] } } })),
        api.get('/events/my-events').catch(() => ({ data: { data: { events: [] } } })),
        api.get('/auth/profile').catch(() => ({ data: { data: { name: user?.name || '', phone: '' } } }))
      ]);
      
      setEnrollments(learningRes.data.data.enrollments || []);
      setCertsCount(certsRes.data.data.certificates?.length || 0);
      setEventsCount(eventsRes.data.data.events?.length || 0);
      setEditName(profileRes.data.data.name || user?.name || '');
      setEditPhone(profileRes.data.data.phone || '');
      if (profileRes.data.data) {
        const d = profileRes.data.data;
        setStudyStats({
          study_mon: d.study_mon || 0,
          study_tue: d.study_tue || 0,
          study_wed: d.study_wed || 0,
          study_thu: d.study_thu || 0,
          study_fri: d.study_fri || 0,
          study_sat: d.study_sat || 0,
          study_sun: d.study_sun || 0,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard info from database.');
      setEnrollments([]);
      setCertsCount(0);
      setEventsCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', { name: editName, phone: editPhone });
      if (res.data.status === 'success') {
        const updatedUser = { ...user, name: editName };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile details updated successfully!');
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update details.');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Section */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 dark:border-amber-900/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              Student Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-amber-600 dark:text-amber-400">{user?.name || 'Student'}</span>! 👋
            </h1>
          </div>
          {/* Welcome Text */}
        </div>
      </div>

      {/* Grid of Key Metrics (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Courses</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{certsCount}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Certificates Earned</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{eventsCount}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live Events</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Learning Progress and Live Events */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" /> Continue Learning
              </h2>
              <Link to="/student/my-courses" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                View All Courses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-slate-500 text-sm">Loading active courses...</div>
            ) : enrollments.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-850 p-8 rounded-2xl text-center space-y-4">
                <p className="text-sm text-slate-500">You are not enrolled in any courses yet. Start your journey today!</p>
                <Link to="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between hover:border-slate-300 dark:hover:border-slate-750 transition-all">
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                      <img src={item.course?.thumbnail} alt={item.course?.title} className="w-20 h-16 rounded-xl object-cover shadow-sm shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{item.course?.title}</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-600 h-full rounded-full" style={{ width: `${item.progressPercentage}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{item.progressPercentage}% complete</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60 pt-3 sm:pt-0">
                      <button
                        onClick={() => setSelectedCourse(item.course)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                      >
                        Overview
                      </button>
                      <Link
                        to={`/learning/player/${item.course?.id || item.course?._id || item.course?.slug || '1'}`}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Resume
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Live Sessions */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> My Live Seminars
            </h2>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6">
              {eventsCount === 0 ? (
                <div className="text-center py-4 space-y-3">
                  <p className="text-sm text-slate-500">No registered live events. Enroll in upcoming seminars!</p>
                  <Link to="/student/events" className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition">
                    View Live Seminars
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">Live Seminar</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">System Design & Web Scaling Masterclass</h4>
                      <p className="text-xs text-slate-500">Scheduled: Tomorrow at 6:00 PM (IST)</p>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition">
                      Launch Zoom Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Time Tracker Widget */}
        <div className="space-y-8">
          {/* Real-time Time Tracker Widget */}
          <StudyTimeTracker studyStats={studyStats} setStudyStats={setStudyStats} />

        </div>

      </div>

      {/* Course Overview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between space-y-6">
            
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-32 h-24 rounded-2xl object-cover shadow-sm border border-slate-200 dark:border-slate-800" />
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-lg sm:text-xl">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedCourse.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="bg-amber-600/10 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                      {selectedCourse.level?.replace('_', ' ') || 'All Levels'}
                    </span>
                    <span className="text-slate-350 dark:text-slate-650">•</span>
                    <span className="text-slate-500 font-medium">{selectedCourse.totalLessons || 8} Lessons</span>
                    <span className="text-slate-350 dark:text-slate-650">•</span>
                    <span className="text-slate-500 font-medium">{selectedCourse.totalDuration || 420} Mins</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Course Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">What You'll Learn</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedCourse.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-start gap-2">
                        <User className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Close Overview
              </button>
              <Link
                to={`/learning/player/${selectedCourse.id || selectedCourse._id || selectedCourse.slug}`}
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Continue Learning</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Quick Edit Profile Details Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-1">Edit Account Profile</h3>
            <p className="text-xs text-slate-500 mb-5">Change your basic account details directly from your dashboard.</p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Save className="w-4 h-4" /> Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
