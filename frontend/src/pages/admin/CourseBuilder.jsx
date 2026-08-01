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
  const [uploadingImage, setUploadingImage] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 499,
    level: 'all_levels',
    thumbnail: '',
    category: '', // initialized empty, loaded dynamically
    rating: 4.8,
    enrolledCount: 0,
    totalDuration: 480,
    language: 'English (Subtitles available)',
    isCertificateIncluded: true,
    certificateTemplate: '',
    certificateLayout: {
      studentName: { x: 50, y: 328, fontSize: 26, isCentered: true },
      courseTitle: { x: 50, y: 250, fontSize: 18, isCentered: true },
      issueDate: { x: 50, y: 178, fontSize: 12, isCentered: true }
    }
  });

  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [templateDimensions, setTemplateDimensions] = useState({ width: 842, height: 595 });
  const canvasRef = React.useRef(null);

  // Load PDF.js script dynamically
  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfJsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      setPdfJsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Render PDF page to canvas
  useEffect(() => {
    if (!pdfJsLoaded || !courseData.certificateTemplate || !canvasRef.current) return;

    let active = true;
    (async () => {
      try {
        let base64 = courseData.certificateTemplate;
        if (base64.startsWith('data:application/pdf;base64,')) {
          base64 = base64.replace('data:application/pdf;base64,', '');
        }
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;
        if (!active) return;

        const page = await pdf.getPage(1);
        if (!active) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set dimensions for landscape aspect ratio
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        setTemplateDimensions({
          width: unscaledViewport.width,
          height: unscaledViewport.height
        });

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Failed to render PDF preview:', err);
      }
    })();

    return () => {
      active = false;
    };
  }, [pdfJsLoaded, courseData.certificateTemplate]);



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
          category: c.category || '',
          rating: c.rating !== undefined ? c.rating : 4.8,
          enrolledCount: c.enrolledCount !== undefined ? c.enrolledCount : 0,
          totalDuration: c.totalDuration !== undefined ? c.totalDuration : 480,
          language: c.language || 'English (Subtitles available)',
          isCertificateIncluded: c.isCertificateIncluded !== undefined ? Boolean(c.isCertificateIncluded) : true,
          certificateTemplate: c.certificateTemplate || '',
          certificateLayout: (typeof c.certificateLayout === 'string' ? JSON.parse(c.certificateLayout) : c.certificateLayout) || {
            studentName: { x: 50, y: 328, fontSize: 26, isCentered: true },
            courseTitle: { x: 50, y: 250, fontSize: 18, isCentered: true },
            issueDate: { x: 50, y: 178, fontSize: 12, isCentered: true }
          }
        });
        
        if (c.learningOutcomes && Array.isArray(c.learningOutcomes)) {
          setLearningOutcomes(c.learningOutcomes.length > 0 ? c.learningOutcomes : ['']);
        }

        if (c.modules && Array.isArray(c.modules)) {
          const formattedModules = c.modules.map(mod => ({
            title: mod.title,
            order: mod.order,
            lessons: (mod.lessons || []).map(les => ({
              _id: les._id || les.id || `les-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: les.title,
              type: les.type || 'video',
              duration: les.duration || 0,
              isPreview: les.isPreview || false,
              videoUrl: les.videoUrl || '',
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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64Data = await fileToBase64(file);
      setCourseData(prev => ({ ...prev, thumbnail: base64Data }));
      toast.success('Thumbnail uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to read image file.');
    } finally {
      setUploadingImage(false);
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
      _id: `les-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${prefix} ${count}: New Item`,
      type,
      duration: type === 'video' ? 600 : 0,
      isPreview: false,
      videoUrl: '',
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
        status: 'published',
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
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save course to database.');
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
        <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Web Development"
                value={courseData.category}
                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Course Thumbnail</label>
              <div className="flex items-center gap-4">
                {courseData.thumbnail && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-800 shrink-0">
                    <img src={courseData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer select-none">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {uploadingImage ? 'Uploading image...' : 'Choose image file'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={courseData.rating}
                onChange={(e) => setCourseData({ ...courseData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enrolled Count</label>
              <input
                type="number"
                value={courseData.enrolledCount}
                onChange={(e) => setCourseData({ ...courseData, enrolledCount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (mins)</label>
              <input
                type="number"
                value={courseData.totalDuration}
                onChange={(e) => setCourseData({ ...courseData, totalDuration: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Language</label>
              <input
                type="text"
                value={courseData.language}
                onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col justify-end pb-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={courseData.isCertificateIncluded}
                  onChange={(e) => setCourseData({ ...courseData, isCertificateIncluded: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-0"
                />
                Certificate Included
              </label>
            </div>

            {courseData.isCertificateIncluded && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Certificate PDF Template (A4 Landscape PDF format)
                </label>
                <div className="flex items-center gap-4">
                  {courseData.certificateTemplate && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Template Uploaded</span>
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer select-none">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {courseData.certificateTemplate ? 'Change PDF Template' : 'Choose PDF Template File'}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const base64Data = await fileToBase64(file);
                          setCourseData(prev => ({ ...prev, certificateTemplate: base64Data }));
                          toast.success('Certificate template loaded successfully!');
                        } catch (err) {
                          toast.error('Failed to read PDF file.');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {courseData.isCertificateIncluded && courseData.certificateTemplate && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-5 pt-4 mt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4 text-left">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Configure Overlay Text Layout & Live Preview
                </h4>
                
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
                  {/* Left Column: Form Controls */}
                  <div className="xl:col-span-2 space-y-4">
                    {/* Student Name Layout */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        Student Name Field
                      </span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={courseData.certificateLayout?.studentName?.isCentered ?? true}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.studentName = { ...layout.studentName, isCentered: e.target.checked };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="rounded text-primary-600 focus:ring-0"
                          />
                          Center Horizontally
                        </label>
                        
                        {!(courseData.certificateLayout?.studentName?.isCentered ?? true) && (
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 mb-1">X Position (pt)</label>
                            <input
                              type="number"
                              value={courseData.certificateLayout?.studentName?.x ?? 50}
                              onChange={(e) => {
                                const layout = { ...courseData.certificateLayout };
                                layout.studentName = { ...layout.studentName, x: Number(e.target.value) };
                                setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Y Position (pt from bottom)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.studentName?.y ?? 328}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.studentName = { ...layout.studentName, y: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Font Size (pt)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.studentName?.fontSize ?? 26}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.studentName = { ...layout.studentName, fontSize: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course Title Layout */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        Course Title Field
                      </span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={courseData.certificateLayout?.courseTitle?.isCentered ?? true}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.courseTitle = { ...layout.courseTitle, isCentered: e.target.checked };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="rounded text-primary-600 focus:ring-0"
                          />
                          Center Horizontally
                        </label>
                        
                        {!(courseData.certificateLayout?.courseTitle?.isCentered ?? true) && (
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 mb-1">X Position (pt)</label>
                            <input
                              type="number"
                              value={courseData.certificateLayout?.courseTitle?.x ?? 50}
                              onChange={(e) => {
                                const layout = { ...courseData.certificateLayout };
                                layout.courseTitle = { ...layout.courseTitle, x: Number(e.target.value) };
                                setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Y Position (pt from bottom)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.courseTitle?.y ?? 250}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.courseTitle = { ...layout.courseTitle, y: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Font Size (pt)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.courseTitle?.fontSize ?? 18}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.courseTitle = { ...layout.courseTitle, fontSize: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Completion Date Layout */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        Completion Date Field
                      </span>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={courseData.certificateLayout?.issueDate?.isCentered ?? true}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.issueDate = { ...layout.issueDate, isCentered: e.target.checked };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="rounded text-primary-600 focus:ring-0"
                          />
                          Center Horizontally
                        </label>
                        
                        {!(courseData.certificateLayout?.issueDate?.isCentered ?? true) && (
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 mb-1">X Position (pt)</label>
                            <input
                              type="number"
                              value={courseData.certificateLayout?.issueDate?.x ?? 50}
                              onChange={(e) => {
                                const layout = { ...courseData.certificateLayout };
                                layout.issueDate = { ...layout.issueDate, x: Number(e.target.value) };
                                setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Y Position (pt from bottom)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.issueDate?.y ?? 178}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.issueDate = { ...layout.issueDate, y: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Font Size (pt)</label>
                          <input
                            type="number"
                            value={courseData.certificateLayout?.issueDate?.fontSize ?? 12}
                            onChange={(e) => {
                              const layout = { ...courseData.certificateLayout };
                              layout.issueDate = { ...layout.issueDate, fontSize: Number(e.target.value) };
                              setCourseData(prev => ({ ...prev, certificateLayout: layout }));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Visual Canvas */}
                  <div className="xl:col-span-3 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      Live Template Overview
                    </span>
                    <div 
                      className="relative w-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg bg-slate-900/5 aspect-[842/595] select-none"
                      style={{ containerType: 'inline-size' }}
                    >
                      {/* PDF Preview Canvas */}
                      <canvas 
                        ref={canvasRef} 
                        className="w-full h-full object-contain" 
                      />

                      {/* HTML Overlay text representing PDF placement */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Student Name */}
                        <div style={{
                          position: 'absolute',
                          left: courseData.certificateLayout?.studentName?.isCentered ?? true ? '50%' : `${(courseData.certificateLayout?.studentName?.x ?? 50) / templateDimensions.width * 100}%`,
                          bottom: `${(courseData.certificateLayout?.studentName?.y ?? 328) / templateDimensions.height * 100}%`,
                          transform: courseData.certificateLayout?.studentName?.isCentered ?? true ? 'translateX(-50%)' : 'none',
                          fontSize: `${(courseData.certificateLayout?.studentName?.fontSize ?? 26) / templateDimensions.width * 100}cqw`,
                          fontWeight: 'bold',
                          color: '#1E2E4A',
                          fontFamily: 'serif',
                          lineHeight: '1.0',
                          whiteSpace: 'nowrap'
                        }}>
                          [Student Name]
                        </div>

                        {/* Course Name */}
                        <div style={{
                          position: 'absolute',
                          left: courseData.certificateLayout?.courseTitle?.isCentered ?? true ? '50%' : `${(courseData.certificateLayout?.courseTitle?.x ?? 50) / templateDimensions.width * 100}%`,
                          bottom: `${(courseData.certificateLayout?.courseTitle?.y ?? 250) / templateDimensions.height * 100}%`,
                          transform: courseData.certificateLayout?.courseTitle?.isCentered ?? true ? 'translateX(-50%)' : 'none',
                          fontSize: `${(courseData.certificateLayout?.courseTitle?.fontSize ?? 18) / templateDimensions.width * 100}cqw`,
                          fontWeight: 'bold',
                          color: '#1E2E4A',
                          fontFamily: 'sans-serif',
                          lineHeight: '1.0',
                          whiteSpace: 'nowrap'
                        }}>
                          {courseData.title || '[Course Title]'}
                        </div>

                        {/* Completion Date */}
                        <div style={{
                          position: 'absolute',
                          left: courseData.certificateLayout?.issueDate?.isCentered ?? true ? '50%' : `${(courseData.certificateLayout?.issueDate?.x ?? 50) / templateDimensions.width * 100}%`,
                          bottom: `${(courseData.certificateLayout?.issueDate?.y ?? 178) / templateDimensions.height * 100}%`,
                          transform: courseData.certificateLayout?.issueDate?.isCentered ?? true ? 'translateX(-50%)' : 'none',
                          fontSize: `${(courseData.certificateLayout?.issueDate?.fontSize ?? 12) / templateDimensions.width * 100}cqw`,
                          color: '#374151',
                          fontFamily: 'sans-serif',
                          lineHeight: '1.0',
                          whiteSpace: 'nowrap'
                        }}>
                          [Date of Completion]
                        </div>

                        {/* QR Code Placeholder */}
                        <div style={{
                          position: 'absolute',
                          right: `${110 / templateDimensions.width * 100}%`,
                          bottom: `${40 / templateDimensions.height * 100}%`,
                          width: `${70 / templateDimensions.width * 100}%`,
                          height: `${70 / templateDimensions.height * 100}%`,
                          border: '1.5px dashed #10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2cqw',
                          color: '#047857',
                          fontWeight: 'bold',
                          borderRadius: '4px'
                        }}>
                          QR Code
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
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
              <div key={mIdx} className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 relative">
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
                    <div key={lIdx} className="space-y-3 p-3 sm:p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                        <div className="flex-1 flex items-center gap-2 min-w-[140px]">
                          {les.type === 'quiz' ? (
                            <HelpCircle className="w-4 h-4 text-primary-600 shrink-0" />
                          ) : (
                            <Video className="w-4 h-4 text-secondary-500 shrink-0" />
                          )}
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => updateLessonField(mIdx, lIdx, 'title', e.target.value)}
                            className="flex-1 font-semibold text-xs bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none text-slate-700 dark:text-slate-200 py-0.5 min-w-0"
                            placeholder={les.type === 'quiz' ? 'Quiz Title' : 'Lesson Title'}
                          />
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
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
                      </div>

                      {les.type === 'video' && (
                        <div className="pt-2 pl-6 text-left">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">YouTube Video Link</label>
                          <input
                            type="text"
                            value={les.videoUrl || ''}
                            onChange={(e) => updateLessonField(mIdx, lIdx, 'videoUrl', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          />
                        </div>
                      )}

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
