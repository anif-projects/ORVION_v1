import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, MapPin, Target, CheckCircle2, Sparkles, Award, 
  ArrowRight, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OfflineProgramsSection() {
  const [activeDetailProgram, setActiveDetailProgram] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');

  const programs = [
    {
      id: 'sap',
      badge: 'ENTERPRISE',
      title: 'SAP',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      description: 'Master SAP fundamentals through hands-on enterprise workflows and business process simulations. Build practical ERP skills aligned with industry standards.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The SAP Career Accelerator is an intensive 4-month offline classroom cohort designed to bridge the gap between academic learning and enterprise ERP execution. During the first 3 months, students master SAP S/4HANA workflows, FICO financial accounting, and business process integration in hands-on computer labs. The final month concludes with a guaranteed 1-month industry internship working on live corporate project simulations.',
    },
    {
      id: 'cybersecurity',
      badge: 'HIGH DEMAND',
      title: 'Cybersecurity',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
      description: 'Learn ethical hacking, network security, penetration testing, vulnerability assessment, and modern cyber defense techniques.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Cybersecurity Career Accelerator provides a comprehensive hands-on journey through ethical hacking, network packet analysis, vulnerability management, and cyber defense operations. Over 3 months of immersive classroom training in dedicated security labs, learners master Linux, Metasploit, and OWASP penetration testing tools. The program concludes with a 1-month hands-on security audit internship.',
    },
    {
      id: 'data-science',
      badge: 'TRENDING',
      title: 'Data Science',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      description: 'Learn data analysis, visualization, machine learning, statistics, and real-world business analytics using Python.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Data Science Accelerator equips learners with production-grade data manipulation, machine learning modeling, and business intelligence dashboarding skills. Students spend 3 months mastering Python, Pandas, Scikit-Learn, and Power BI through real dataset projects, followed by a 1-month corporate analytics internship experience to build a verified portfolio.',
    },
    {
      id: 'data-engineering',
      badge: 'INDUSTRY READY',
      title: 'Data Engineering',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      description: 'Build scalable data pipelines, ETL workflows, cloud-based architectures, and modern big data processing systems.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Data Engineering Accelerator focuses on constructing scalable ETL pipelines, cloud data warehouses, and distributed big data workflows. Over 3 months of hands-on lab training, students master advanced SQL, Python pipelines, Apache Spark, and cloud data architecture, ending with a 1-month industry internship building enterprise data pipelines.',
    },
    {
      id: 'devops',
      badge: 'CLOUD',
      title: 'DevOps',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
      description: 'Master CI/CD pipelines, Docker, Kubernetes, Linux administration, cloud deployment, monitoring, and automation.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The DevOps Career Accelerator prepares students for cloud engineering and infrastructure automation roles. Across 3 months of intensive lab work, learners gain deep proficiency in Linux administration, Docker containerization, Kubernetes orchestration, AWS cloud, and CI/CD pipelines, culminating in a 1-month cloud deployment internship.',
    },
  ];

  const eligibilityChecklist = [
    'Any Graduate / Final Year Student',
    'Basic Computer Knowledge',
    'Interest in Technology',
    'Willingness to Learn'
  ];

  const handleRegisterClick = (program) => {
    setActiveDetailProgram(program);
    setAppliedSuccess(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
  };

  const handleFinalRegister = (e) => {
    e.preventDefault();
    setAppliedSuccess(true);
    toast.success(`Registration submitted for ${activeDetailProgram.title}!`);
  };

  return (
    <section className="mt-8 pt-4 border-t border-[#F2E5D8] dark:border-slate-800">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Offline Classroom Programs</h2>
        <p className="text-xs text-slate-500 mt-1">In-person classroom training with hands-on lab sessions and dedicated placement guidance.</p>
      </div>

      {/* ULTRA-COMPACT PREVIEW CARDS GRID (Shifted Upwards cleanly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog, index) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] mx-auto bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden group"
          >
            <div className="space-y-3">
              {/* Cover Image Banner (h-[160px]) */}
              <div className="relative h-[160px] w-full rounded-[16px] overflow-hidden">
                {/* Category Badge */}
                <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md bg-gradient-to-r from-[#A65800] to-[#D47A00]">
                  {prog.badge}
                </span>

                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Title & Meta Info */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight line-clamp-1 group-hover:text-[#A65800] transition-colors">
                  {prog.title}
                </h3>

                {/* Single Row Meta Info: 🕒 4 Months • 📍 Ongole • 🎯 Placement & Training Guidance */}
                <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.mode}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.meta}
                  </span>
                </div>

                {/* 2-line Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2 pt-0.5">
                  {prog.description}
                </p>
              </div>
            </div>

            {/* Bottom Card Footer: Info Ribbon & Light Theme Pill Register Button */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Info Ribbon (h-[38px]) */}
              <div className="h-[38px] w-full rounded-full bg-[#FFF5EA] dark:bg-amber-950/40 border border-[#FFE4C4] dark:border-amber-900/50 text-[#A65800] font-bold text-xs flex items-center justify-center gap-1.5">
                <span>{prog.highlight}</span>
              </div>

              {/* Premium Light Theme Pill Register Button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex justify-center mt-[24px] mb-[20px]"
              >
                <button
                  onClick={() => handleRegisterClick(prog)}
                  className="w-fit h-[52px] px-[24px] rounded-[18px] bg-[#FFF7F0] dark:bg-amber-950/40 border border-[#F3D7B5] dark:border-amber-900/50 text-[#C46A00] hover:text-[#D57A00] font-bold text-[18px] shadow-[0_6px_20px_rgba(180,120,40,0.08)] hover:shadow-[0_12px_30px_rgba(195,110,20,0.15)] hover:bg-[#FFF1E2] dark:hover:bg-amber-950/70 hover:border-[#E7B97A] dark:hover:border-amber-700/60 hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-250 ease-out flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <span>Register</span>
                  <ArrowRight className="w-[16px] h-[16px] text-[#C46A00] transition-transform duration-250 group-hover/btn:translate-x-1.5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DEDICATED COURSE DETAILS MODAL WITH PURE WHITE BACKGROUND OUTSIDE HERO CARD */}
      <AnimatePresence>
        {activeDetailProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 rounded-[32px] max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col relative"
            >
              {/* Modal Header Bar */}
              <div className="sticky top-0 z-20 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#A65800]">
                  <Sparkles className="w-4 h-4" />
                  <span>ORVION CAREER ACCELERATOR</span>
                </div>
                <button
                  onClick={() => setActiveDetailProgram(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body (Clean White Modal Background Outside Hero Card) */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-8 bg-white dark:bg-slate-900">
                {/* 1. HERO SECTION (Dark Navy Gradient Strictly Inside Rounded Hero Card) */}
                <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1E2E4A] via-[#112338] to-[#0A1220] text-white p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl isolate">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D47A00] text-white">
                      {activeDetailProgram.badge}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D47A00]" /> {activeDetailProgram.duration}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {activeDetailProgram.mode}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> {activeDetailProgram.meta}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {activeDetailProgram.title} Program
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                    {activeDetailProgram.description}
                  </p>

                  <div className="pt-1">
                    <a
                      href="#register-section"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A65800] to-[#D47A00] shadow-md hover:scale-105 transition"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 2. PROGRAM OVERVIEW */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#A65800]">Program Overview</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">About the Course</h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {activeDetailProgram.overviewText}
                  </p>
                </div>

                {/* 3. ELIGIBILITY CRITERIA */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#A65800]">Requirements</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">Eligibility Criteria</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eligibilityChecklist.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#A65800] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. OFFICIAL ORVION CERTIFICATE */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/60 to-white dark:from-slate-800 dark:to-slate-900 border border-[#F2E5D8] dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A65800] to-[#D47A00] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">Official Orvion Certificate of Completion</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Earn a verifiable Orvion Certificate of Completion along with a 1-Month Industry Internship Experience Letter to strengthen your resume and showcase your practical skills to employers.
                    </p>
                  </div>
                </div>

                {/* 5. FULLY TRANSPARENT REGISTRATION CTA SECTION */}
                <div id="register-section" className="py-[48px] px-0 mt-[40px] bg-transparent backdrop-none border-none shadow-none space-y-6">
                  <div className="text-center max-w-md mx-auto space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#A65800]">REGISTRATION</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white">Ready to Begin Your Career Journey?</h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">Reserve your seat today and start building industry-ready skills with Orvion.</p>
                  </div>

                  {appliedSuccess ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-500" />
                      <h3 className="font-bold text-base">Registration Received!</h3>
                      <p className="text-xs">Our admissions counselor will contact you within 24 hours to confirm your seat.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFinalRegister} className="max-w-sm mx-auto space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 text-xs rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D47A00] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 text-xs rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D47A00] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-4 py-3 text-xs rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D47A00] transition"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl font-extrabold text-xs tracking-wide uppercase text-white bg-gradient-to-r from-[#A65800] to-[#D47A00] shadow-md hover:scale-[1.02] transition cursor-pointer"
                      >
                        Register Now
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
