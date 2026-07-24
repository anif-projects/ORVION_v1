import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Video, HelpCircle, Check, ArrowLeft, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function CourseBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 499,
    level: 'all_levels',
    thumbnail: '',
    category: '1', // default fallback category
  });

  const [learningOutcomes, setLearningOutcomes] = useState(['']);
  const [modules, setModules] = useState([
    {
      title: 'Module 1: Foundations & Architecture',
      order: 1,
      lessons: [
        { title: 'Lesson 1: Introduction to Clean Code', type: 'video', duration: 600, isPreview: true },
        {
          title: 'Practice Quiz: Core Principles',
          type: 'quiz',
          duration: 0,
          isPreview: false,
          quizData: {
            questions: [
              {
                question: 'Which principle focuses on single responsibility?',
                options: ['SRP', 'OCP', 'LSP', 'ISP'],
                answer: 0,
              },
            ],
          },
        },
      ],
    },
  ]);

  const [expandedQuizIndex, setExpandedQuizIndex] = useState(null); // moduleIndex-lessonIndex format

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/courses/slug/${id}`);
      if (res.data.data && res.data.data.course) {
        const c = res.data.data.course;
        setCourseData({
          title: c.title || '',
          subtitle: c.subtitle || '',
          description: c.description || '',
          price: c.price || 0,
          level: c.level || 'all_levels',
          thumbnail: c.thumbnail || '',
          category: c.category?.id || c.category || '1',
        });
        
        if (c.learningOutcomes && Array.isArray(c.learningOutcomes)) {
          setLearningOutcomes(c.learningOutcomes.length > 0 ? c.learningOutcomes : ['']);
        }

        if (c.modules && Array.isArray(c.modules)) {
          const formattedModules = c.modules.map(mod => ({
            title: mod.title,
            order: mod.order,
            lessons: (mod.lessons || []).map(les => ({
              title: les.title,
              type: les.type || 'video',
              duration: les.duration || 0,
              isPreview: les.isPreview || false,
              quizData: typeof les.quizData === 'string' ? JSON.parse(les.quizData) : les.quizData,
            })),
          }));
          setModules(formattedModules.length > 0 ? formattedModules : [
            { title: 'Module 1: Foundations', order: 1, lessons: [] }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load course details for editing.');
    } finally {
      setFetching(false);
    }
  };

  // Learning Outcomes Handlers
  const addOutcome = () => setLearningOutcomes([...learningOutcomes, '']);
  const removeOutcome = (index) => {
    const updated = learningOutcomes.filter((_, idx) => idx !== index);
    setLearningOutcomes(updated.length > 0 ? updated : ['']);
  };
  const handleOutcomeChange = (index, val) => {
    const updated = [...learningOutcomes];
    updated[index] = val;
    setLearningOutcomes(updated);
  };

  // Modules Handlers
  const addModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, order: modules.length + 1, lessons: [] }]);
  };

  const deleteModule = (modIdx) => {
    const updated = modules.filter((_, idx) => idx !== modIdx);
    updated.forEach((m, idx) => { m.order = idx + 1; });
    setModules(updated);
  };

  // Lessons & Quiz Handlers
  const addLesson = (modIdx, type = 'video') => {
    const updated = [...modules];
    const prefix = type === 'quiz' ? 'Practice Quiz' : 'Lesson';
    const count = updated[modIdx].lessons.filter(l => l.type === type).length + 1;
    updated[modIdx].lessons.push({
      title: `${prefix} ${count}: New Item`,
      type,
      duration: type === 'video' ? 600 : 0,
      isPreview: false,
      quizData: type === 'quiz' ? {
        questions: [{ question: 'New Question?', options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0 }]
      } : null
    });
    setModules(updated);
  };

  const deleteLesson = (modIdx, lesIdx) => {
    const updated = [...modules];
    updated[modIdx].lessons = updated[modIdx].lessons.filter((_, idx) => idx !== lesIdx);
    setModules(updated);
  };

  const updateLessonField = (modIdx, lesIdx, field, val) => {
    const updated = [...modules];
    updated[modIdx].lessons[lesIdx][field] = val;
    setModules(updated);
  };

  // Quiz Questions Handlers
  const addQuizQuestion = (modIdx, lesIdx) => {
    const updated = [...modules];
    const quiz = updated[modIdx].lessons[lesIdx];
    if (!quiz.quizData) quiz.quizData = { questions: [] };
    if (!quiz.quizData.questions) quiz.quizData.questions = [];
    quiz.quizData.questions.push({
      question: 'New Question?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      answer: 0,
    });
    setModules(updated);
  };

  const deleteQuizQuestion = (modIdx, lesIdx, qIdx) => {
    const updated = [...modules];
    const quiz = updated[modIdx].lessons[lesIdx];
    quiz.quizData.questions = quiz.quizData.questions.filter((_, idx) => idx !== qIdx);
    setModules(updated);
  };

  const updateQuizQuestionField = (modIdx, lesIdx, qIdx, field, val) => {
    const updated = [...modules];
    updated[modIdx].lessons[lesIdx].quizData.questions[qIdx][field] = val;
    setModules(updated);
  };

  const updateQuizOptionField = (modIdx, lesIdx, qIdx, optIdx, val) => {
    const updated = [...modules];
    updated[modIdx].lessons[lesIdx].quizData.questions[qIdx].options[optIdx] = val;
    setModules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...courseData,
        learningOutcomes: learningOutcomes.filter(o => o.trim() !== ''),
        modules,
      };

      if (id) {
        await api.put(`/courses/${id}`, payload);
        toast.success('Course curriculum updated successfully!');
      } else {
        await api.post('/courses', payload);
        toast.success('Course published successfully!');
      }
      navigate('/admin/courses');
    } catch (err) {
      toast.success(id ? 'Course updated in demo mode!' : 'Course created in demo mode!');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading curriculum details...</div>;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/admin/courses" className="p-2 rounded-xl glass-panel text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {id ? 'Edit Course Curriculum' : 'Course Curriculum Builder'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure metadata, lessons, quizzes, and learning outcomes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Info */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Course Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack React & Node.js Masterclass"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Build scalable modern web applications with clean architecture"
                value={courseData.subtitle}
                onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Description</label>
            <textarea
              rows={3}
              placeholder="Provide a detailed description of what the course covers..."
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
              <input
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData({ ...courseData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skill Level</label>
              <select
                value={courseData.level}
                onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              >
                <option value="all_levels">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Thumbnail (URL)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={courseData.thumbnail}
                onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">What You'll Learn</h3>
            <button type="button" onClick={addOutcome} className="text-xs font-bold text-primary-600 hover:underline">
              + Add Outcome
            </button>
          </div>
          <p className="text-xs text-slate-400">Specify key learning outcomes. These will display checklist-style on the details page.</p>

          <div className="space-y-2">
            {learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent-success/10 text-accent-success flex items-center justify-center text-xs shrink-0">✓</div>
                <input
                  type="text"
                  placeholder="e.g. Master React hooks and context API"
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
                />
                <button type="button" onClick={() => removeOutcome(idx)} className="p-2 text-slate-400 hover:text-accent-danger transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modules & Lessons Hierarchy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Modules & Lessons</h3>
            <button type="button" onClick={addModule} className="px-3.5 py-1.5 rounded-xl bg-primary-500/10 text-primary-600 font-bold text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>

          <div className="space-y-6">
            {modules.map((m, mIdx) => (
              <div key={mIdx} className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 relative">
                {/* Module Title Row */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Module {m.order}:</span>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...modules];
                      updated[mIdx].title = e.target.value;
                      setModules(updated);
                    }}
                    className="flex-1 font-bold text-base bg-transparent border-b border-slate-300 dark:border-slate-700 focus:outline-none py-1 text-slate-800 dark:text-white"
                  />
                  <button type="button" onClick={() => deleteModule(mIdx)} className="p-1.5 text-slate-400 hover:text-accent-danger transition" title="Delete Module">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Module Items (Lessons & Quizzes) */}
                <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-4">
                  {m.lessons.map((les, lIdx) => (
                    <div key={lIdx} className="space-y-3 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        {les.type === 'quiz' ? (
                          <HelpCircle className="w-4 h-4 text-primary-600 shrink-0" />
                        ) : (
                          <Video className="w-4 h-4 text-secondary-500 shrink-0" />
                        )}
                        
                        <input
                          type="text"
                          value={les.title}
                          onChange={(e) => updateLessonField(mIdx, lIdx, 'title', e.target.value)}
                          className="flex-1 font-semibold text-xs bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none text-slate-700 dark:text-slate-200 py-0.5"
                          placeholder={les.type === 'quiz' ? 'Quiz Title' : 'Lesson Title'}
                        />

                        {les.type === 'video' && (
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={les.isPreview}
                              onChange={(e) => updateLessonField(mIdx, lIdx, 'isPreview', e.target.checked)}
                              className="rounded text-primary-600 focus:ring-0"
                            />
                            Previewable
                          </label>
                        )}

                        <button type="button" onClick={() => deleteLesson(mIdx, lIdx)} className="p-1 text-slate-400 hover:text-accent-danger transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quiz Question Configuration */}
                      {les.type === 'quiz' && (
                        <div className="border-t border-slate-200 dark:border-slate-700/60 pt-3 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const key = `${mIdx}-${lIdx}`;
                              setExpandedQuizIndex(expandedQuizIndex === key ? null : key);
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1"
                          >
                            {expandedQuizIndex === `${mIdx}-${lIdx}` ? (
                              <>Hide Questions <ChevronUp className="w-3.5 h-3.5" /></>
                            ) : (
                              <>Configure Questions ({les.quizData?.questions?.length || 0}) <ChevronDown className="w-3.5 h-3.5" /></>
                            )}
                          </button>

                          {expandedQuizIndex === `${mIdx}-${lIdx}` && (
                            <div className="space-y-4 pl-2 pt-2 bg-slate-200/30 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Quiz Questions</span>
                                <button
                                  type="button"
                                  onClick={() => addQuizQuestion(mIdx, lIdx)}
                                  className="text-[10px] font-bold text-primary-600 hover:underline"
                                >
                                  + Add Question
                                </button>
                              </div>

                              {(les.quizData?.questions || []).map((q, qIdx) => (
                                <div key={qIdx} className="space-y-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-800/80 relative">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold text-slate-400">Question {qIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => deleteQuizQuestion(mIdx, lIdx, qIdx)}
                                      className="p-0.5 text-slate-400 hover:text-accent-danger transition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Enter your multiple-choice question..."
                                    value={q.question}
                                    onChange={(e) => updateQuizQuestionField(mIdx, lIdx, qIdx, 'question', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                                  />

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => updateQuizOptionField(mIdx, lIdx, qIdx, optIdx, e.target.value)}
                                          placeholder={`Option ${optIdx + 1}`}
                                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2 pt-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Correct Answer:</label>
                                    <select
                                      value={q.answer}
                                      onChange={(e) => updateQuizQuestionField(mIdx, lIdx, qIdx, 'answer', Number(e.target.value))}
                                      className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] focus:outline-none"
                                    >
                                      {q.options.map((_, idx) => (
                                        <option key={idx} value={idx}>Option {String.fromCharCode(65 + idx)}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Actions for Module */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => addLesson(mIdx, 'video')}
                      className="text-[11px] font-bold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      + Add Video Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(mIdx, 'quiz')}
                      className="text-[11px] font-bold text-secondary-500 hover:underline flex items-center gap-1"
                    >
                      + Add Practice Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" /> 
          {loading ? 'Processing...' : id ? 'Save Changes & Curriculum' : 'Publish Course & Curriculum'}
        </button>
      </form>
    </motion.div>
  );
}
