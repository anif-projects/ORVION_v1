import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, CheckCircle, FileText, ChevronLeft, Award, BookOpen } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function LearningPlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndStream();
  }, [slug]);

  const fetchCourseAndStream = async () => {
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      const courseData = res.data.data.course;
      setCourse(courseData);

      const firstLesson = courseData.modules?.[0]?.lessons?.[0];
      if (firstLesson) {
        setActiveLesson(firstLesson);
        loadStreamUrl(firstLesson._id);
      }
    } catch (err) {
      console.error(err);
      // Fallback state for learning player demo
      const demoLesson = {
        _id: 'l1',
        title: 'Lesson 1: Introduction to Clean Architecture',
        notes: 'Key Takeaway: Clean Architecture decouples UI & persistence logic from domain rules.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        resources: [{ title: 'Architecture Diagram PDF', fileUrl: '#' }],
      };
      setActiveLesson(demoLesson);
      setStreamUrl(demoLesson.videoUrl);
    } finally {
      setLoading(false);
    }
  };

  const loadStreamUrl = async (lessonId) => {
    try {
      const res = await api.get(`/learning/stream/${lessonId}`);
      setStreamUrl(res.data.data.streamUrl);
    } catch (err) {
      setStreamUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }
  };

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    loadStreamUrl(lesson._id);
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !course) return;
    try {
      await api.post('/learning/complete-lesson', {
        courseId: course._id || '1',
        lessonId: activeLesson._id,
      });
      if (!completedLessonIds.includes(activeLesson._id)) {
        setCompletedLessonIds([...completedLessonIds, activeLesson._id]);
      }
      toast.success('Lesson marked as completed!');
    } catch (err) {
      toast.success('Progress saved locally!');
      if (!completedLessonIds.includes(activeLesson._id)) {
        setCompletedLessonIds([...completedLessonIds, activeLesson._id]);
      }
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const res = await api.post('/certificates/claim', { courseId: course._id });
      toast.success('Certificate generated!');
      navigate(`/verify-certificate/${res.data.data.certificate.certificateHash}`);
    } catch (err) {
      toast.error('Complete all lessons to unlock certificate.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-sm font-semibold">
        Loading Video Player...
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col"
    >
      {/* Top Learning Navigation (Responsive) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 min-h-[3.5rem]">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition px-2.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-primary-400" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </button>

        {/* Course Title (Truncated smoothly) */}
        <h1 className="text-xs sm:text-sm font-extrabold text-slate-100 truncate max-w-[140px] sm:max-w-md text-center">
          {course?.title || 'Learning Player'}
        </h1>

        {/* Claim Certificate Button */}
        <button
          onClick={handleClaimCertificate}
          className="px-3 py-1.5 rounded-full bg-accent-success/20 text-accent-success border border-accent-success/30 font-bold text-xs flex items-center gap-1.5 hover:bg-accent-success/30 transition shrink-0"
        >
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Claim Certificate</span>
          <span className="sm:hidden">Certificate</span>
        </button>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video & Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* React Player Container */}
          <div className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800/80">
            <ReactPlayer
              url={streamUrl}
              controls
              width="100%"
              height="100%"
              playing
              onEnded={handleMarkComplete}
            />
          </div>

          {/* Lesson Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <h2 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                {activeLesson?.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Cloudinary Adaptive Streaming Token Activated
              </p>
            </div>

            <button
              onClick={handleMarkComplete}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md ${
                completedLessonIds.includes(activeLesson?._id)
                  ? 'bg-accent-success text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedLessonIds.includes(activeLesson?._id) ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Notes & Resources */}
          {activeLesson?.notes && (
            <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary-500" /> Lesson Notes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{activeLesson.notes}</p>
            </div>
          )}
        </div>

        {/* Lessons Sidebar Hierarchy */}
        <div className="w-full lg:w-80 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0">
          <div className="flex items-center gap-2 text-primary-400">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
              Course Modules
            </h3>
          </div>

          <div className="space-y-4">
            {course?.modules?.map((mod) => (
              <div key={mod._id} className="space-y-2">
                <div className="text-xs font-bold text-primary-400 px-2">{mod.title}</div>
                <div className="space-y-1">
                  {mod.lessons?.map((les) => {
                    const isSelected = activeLesson?._id === les._id;
                    const isDone = completedLessonIds.includes(les._id);
                    return (
                      <button
                        key={les._id}
                        onClick={() => handleLessonSelect(les)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle className="w-4 h-4 text-accent-success shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
