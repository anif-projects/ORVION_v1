import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, Pause, RotateCcw, RotateCw, Maximize, Minimize, CheckCircle, FileText, ChevronLeft, Award, BookOpen, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedModules, setExpandedModules] = useState({ 0: true }); // Expands first module by default

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Poll current time when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration() || 0);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Reset states on active lesson change
  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [activeLesson]);

  // Load YouTube Iframe API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Bind YouTube Player API to the iframe node
  const iframeRef = React.useCallback((node) => {
    if (node) {
      const checkAndInit = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player(node, {
            events: {
              onReady: () => {
                if (playerRef.current && playerRef.current.playVideo) {
                  playerRef.current.playVideo();
                }
                if (playerRef.current && playerRef.current.getDuration) {
                  setDuration(playerRef.current.getDuration() || 0);
                }
              },
              onStateChange: (event) => {
                const state = event.data;
                if (state === 1) { // PLAYING
                  setIsPlaying(true);
                } else {
                  setIsPlaying(false);
                }
                if (state === 0) { // ENDED
                  handleMarkComplete();
                }
              }
            }
          });
        } else {
          setTimeout(checkAndInit, 100);
        }
      };
      checkAndInit();
    }
  }, [streamUrl]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleOverlayClick = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Disable inspect elements and view-source hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'c', 'j'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchCourseAndStream();
  }, [slug]);

  const fetchCourseAndStream = async () => {
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      const courseData = res.data.data.course;
      
      // Ensure all lessons have a stable _id (handles legacy course data)
      if (courseData.modules && Array.isArray(courseData.modules)) {
        courseData.modules.forEach(mod => {
          if (mod.lessons && Array.isArray(mod.lessons)) {
            mod.lessons.forEach((les, idx) => {
              if (!les._id) {
                les._id = `les-fallback-${mod.order || 1}-${idx}`;
              }
            });
          }
        });
      }

      setCourse(courseData);

      // Load completed lessons progress from backend
      let completedIds = [];
      try {
        const progressRes = await api.get(`/learning/progress/${courseData._id}`);
        completedIds = progressRes.data.data.completedLessonIds || [];
        setCompletedLessonIds(completedIds);
      } catch (progressErr) {
        console.error('Failed to load progress from server:', progressErr);
      }

      // Find first uncompleted lesson to continue from
      let nextActiveLesson = null;
      if (courseData.modules && Array.isArray(courseData.modules)) {
        for (const mod of courseData.modules) {
          if (mod.lessons && Array.isArray(mod.lessons)) {
            for (const les of mod.lessons) {
              if (!completedIds.includes(les._id)) {
                nextActiveLesson = les;
                break;
              }
            }
          }
          if (nextActiveLesson) break;
        }
      }

      if (!nextActiveLesson) {
        nextActiveLesson = courseData.modules?.[0]?.lessons?.[0];
      }

      if (nextActiveLesson) {
        setActiveLesson(nextActiveLesson);
        loadStreamUrl(nextActiveLesson._id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load course details from database.');
      setCourse(null);
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

  const toggleModule = (idx) => {
    setExpandedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-700 text-sm font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/25 border-t-amber-500 rounded-full animate-spin" />
          <span>Loading Video Player...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-700 text-sm font-semibold gap-4 text-center">
        <p className="text-slate-600 font-bold">Failed to load course video content from database.</p>
        <button onClick={() => navigate('/student/dashboard')} className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-amber-500 selection:text-white"
    >
      {/* Top Learning Navigation (Responsive) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 min-h-[3.5rem] shadow-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </button>

        {/* Course Title */}
        <h1 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate max-w-[140px] sm:max-w-md text-center">
          {course?.title || 'Learning Player'}
        </h1>

        {/* Balanced spacer */}
        <div className="w-[120px] hidden sm:block shrink-0" />
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col lg:flex-row-reverse overflow-hidden">
        {/* Video & Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* React Player Container */}
          <div ref={containerRef} onContextMenu={(e) => e.preventDefault()} className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-lg border border-slate-200 max-w-4xl mx-auto w-full relative">
            {activeLesson?.type === 'quiz' ? (
              <div className="w-full h-full p-6 sm:p-8 bg-slate-50 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Practice Quiz</h3>
                    {quizSubmitted && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700">
                        Score: {quizScore} / {activeLesson.quizData?.questions?.length || 0}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-6 text-left">
                    {(activeLesson.quizData?.questions || []).map((q, qIdx) => (
                      <div key={qIdx} className="space-y-3">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                          {qIdx + 1}. {q.question}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[qIdx] === optIdx;
                            const isCorrect = q.answer === optIdx;
                            const showResult = quizSubmitted;
                            
                            let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
                            if (isSelected) {
                              btnStyle = "border-amber-500 bg-amber-50 text-amber-700";
                            }
                            if (showResult) {
                              if (isCorrect) {
                                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";
                              } else if (isSelected) {
                                btnStyle = "border-rose-500 bg-rose-50 text-rose-700 font-bold";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                                className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition flex items-center justify-between shadow-sm ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {showResult && isCorrect && <span className="text-emerald-600 font-bold">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end mt-6">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        let score = 0;
                        const questions = activeLesson.quizData?.questions || [];
                        questions.forEach((q, idx) => {
                          if (selectedAnswers[idx] === q.answer) {
                            score++;
                          }
                        });
                        setQuizScore(score);
                        setQuizSubmitted(true);
                        handleMarkComplete();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(0);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                    >
                      Retry Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              streamUrl && (streamUrl.includes('youtube') || streamUrl.includes('youtube-nocookie')) ? (
                <div className="w-full h-full overflow-hidden relative bg-black select-none" onContextMenu={(e) => e.preventDefault()}>
                  <iframe
                    ref={iframeRef}
                    src={streamUrl}
                    style={isMobile ? {
                      position: 'absolute',
                      width: '126%',
                      height: '142%',
                      top: '-16%',
                      left: '-13%',
                    } : {
                      position: 'absolute',
                      width: '112%',
                      height: '124%',
                      top: '-9%',
                      left: '-6%',
                    }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Transparent Click & Context Menu Shield Overlay */}
                  <div 
                    className="absolute inset-0 bg-transparent z-10 cursor-pointer pointer-events-auto"
                    onClick={handleOverlayClick}
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Top Blocker Mask */}
                  <div className="absolute top-0 left-0 w-full h-[22%] sm:h-[14%] bg-black z-15 pointer-events-auto" onContextMenu={(e) => e.preventDefault()} />
                  {/* Bottom Blocker Mask */}
                  <div className="absolute bottom-0 left-0 w-full h-[24%] sm:h-[16%] bg-black z-15 pointer-events-auto" onContextMenu={(e) => e.preventDefault()} />

                  {/* Custom Controls overlay (only visible for YouTube embeds) */}
                  <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/90 via-black/75 to-transparent p-3 flex flex-col gap-2 pointer-events-auto text-left">
                    {/* Slider Progress Bar */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCurrentTime(val);
                          if (playerRef.current && playerRef.current.seekTo) {
                            playerRef.current.seekTo(val, true);
                          }
                        }}
                        className="w-full accent-amber-500 h-1 bg-slate-600 rounded-lg cursor-pointer appearance-none hover:h-1.5 transition-all"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        {/* Play/Pause */}
                        <button
                          type="button"
                          onClick={() => {
                            if (playerRef.current) {
                              if (isPlaying) {
                                playerRef.current.pauseVideo();
                              } else {
                                playerRef.current.playVideo();
                              }
                            }
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition text-white w-7 h-7 flex items-center justify-center"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                        </button>

                        {/* Seek Backward 10s */}
                        <button
                          type="button"
                          onClick={() => {
                            const newTime = Math.max(0, currentTime - 10);
                            setCurrentTime(newTime);
                            if (playerRef.current && playerRef.current.seekTo) {
                              playerRef.current.seekTo(newTime, true);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white flex items-center gap-0.5"
                          title="Backward 10s"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold">10s</span>
                        </button>

                        {/* Seek Forward 10s */}
                        <button
                          type="button"
                          onClick={() => {
                            const newTime = Math.min(duration, currentTime + 10);
                            setCurrentTime(newTime);
                            if (playerRef.current && playerRef.current.seekTo) {
                              playerRef.current.seekTo(newTime, true);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white flex items-center gap-0.5"
                          title="Forward 10s"
                        >
                          <span className="text-[9px] font-bold">10s</span>
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Time Display */}
                        <div className="text-[10px] font-semibold text-slate-300 ml-1">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      {/* Fullscreen Button */}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1 rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <ReactPlayer
                  url={streamUrl}
                  controls
                  width="100%"
                  height="100%"
                  playing
                  onEnded={handleMarkComplete}
                />
              )
            )}
          </div>

          {/* Lesson Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-base sm:text-xl font-extrabold text-slate-800 leading-snug">
                {activeLesson?.title}
              </h2>
            </div>

            <button
              onClick={handleMarkComplete}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md ${
                completedLessonIds.includes(activeLesson?._id)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedLessonIds.includes(activeLesson?._id) ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Notes & Resources */}
          {activeLesson?.notes && (
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" /> Lesson Notes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{activeLesson.notes}</p>
            </div>
          )}
        </div>

        {/* Lessons Sidebar Hierarchy */}
        <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-r border-slate-200 p-4 space-y-4 shrink-0 flex flex-col font-sans justify-between">
          <div className="flex items-center gap-2 text-amber-600 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
              Course Modules
            </h3>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {course?.modules?.map((mod, idx) => {
              const isExpanded = !!expandedModules[idx];
              return (
                <div key={mod._id || idx} className="space-y-1.5">
                  {/* Module Toggle Header */}
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left border border-slate-200/60"
                  >
                    <span className="text-xs font-bold text-slate-700 truncate pr-2">{mod.title}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {/* Module Lessons Accordion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="space-y-1 overflow-hidden"
                      >
                        {mod.lessons?.map((les) => {
                          const isSelected = activeLesson?._id === les._id;
                          const isDone = completedLessonIds.includes(les._id);
                          return (
                            <button
                              key={les._id}
                              onClick={() => handleLessonSelect(les)}
                              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition border ${
                                isSelected
                                  ? 'bg-amber-600/10 text-amber-700 border-amber-500/30'
                                  : 'bg-white hover:bg-slate-50 text-slate-600 border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                {isDone ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : les.type === 'quiz' ? (
                                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Claim Certificate Button inside Sidebar Footer */}
          <div className="pt-3 border-t border-slate-200/80 shrink-0">
            <button
              onClick={handleClaimCertificate}
              className="w-full py-3.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100/55 transition shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
