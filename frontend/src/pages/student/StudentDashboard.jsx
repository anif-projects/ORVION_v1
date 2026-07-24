import React, { useState, useEffect } from 'react';
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

export default function StudentDashboard() {
  const { user, setUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certsCount, setCertsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
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
    } catch (err) {
      console.error(err);
      // Fallback state
      setEnrollments([
        {
          _id: 'e1',
          progressPercentage: 65,
          course: {
            _id: '1',
            title: 'Full-Stack React & Node.js Masterclass',
            subtitle: 'Build scalable modern web applications with clean architecture',
            description: 'Master frontend and backend web development using React, Node.js, Express, MySQL, and Redux Toolkit with responsive animations.',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            totalLessons: 8,
            totalDuration: 420,
            level: 'all_levels',
            slug: 'fullstack-react-nodejs-masterclass',
            learningOutcomes: ['Build enterprise React apps', 'Design RESTful Express APIs', 'Implement JWT & Security']
          },
        },
      ]);
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>
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
                        to={`/learning/player/${item.course?.slug || 'fullstack-react-nodejs-masterclass'}`}
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

        {/* Right Column: Profile Summary & Inspiration */}
        <div className="space-y-8">
          
          {/* Profile Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-xl font-black">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{user?.name || 'Student Name'}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Active Student
              </span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{editPhone || 'No phone set'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-600 dark:hover:border-amber-500 dark:hover:text-amber-400 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all"
            >
              Update Account Details
            </button>
          </div>

          {/* Inspirational / Tip Widget */}
          <div className="bg-gradient-to-tr from-amber-600 to-amber-700 rounded-2xl p-6 text-white space-y-3 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <GraduationCap className="w-32 h-32" />
            </div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider opacity-90">Daily Motivation</h4>
            <p className="text-sm font-semibold leading-relaxed">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <div className="text-[10px] opacity-75 font-medium">— Brian Herbert</div>
          </div>

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
                to={`/learning/player/${selectedCourse.slug}`}
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
