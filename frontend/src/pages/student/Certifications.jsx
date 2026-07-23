import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Download, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates/my-certificates');
      if (res.data.data) {
        setCerts(res.data.data.certificates || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load certificates.');
      // Mock fallback
      setCerts([
        {
          id: 'c1',
          certificateHash: 'ORV-8E3B2A1F',
          issueDate: '2026-07-22T12:00:00.000Z',
          course: {
            title: 'Full-Stack React & Node.js Masterclass'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (cert) => {
    // Generate a simple print layout or open the verification route in a new tab for printing
    toast.success('Preparing certificate download...');
    const printUrl = `/verify-certificate/${cert.certificateHash}`;
    window.open(printUrl, '_blank');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Certifications</h1>
        <p className="text-sm text-slate-500 mt-1">View and download your official credentials and course completion certificates.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading certifications...</div>
      ) : certs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-16 h-16 rounded-full bg-primary-600/10 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Certifications Earned Yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Complete any course by finishing all modules and lessons to earn a verifiable completion certificate.
            </p>
          </div>
          <Link to="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-xs shadow-md transition-all">
            Explore Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div key={cert.id || cert.certificateHash} className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl group-hover:bg-primary-600/10 transition-all duration-500" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg line-clamp-1">{cert.course?.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 p-3.5 rounded-2xl space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Verification Hash</div>
                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{cert.certificateHash}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <Link
                  to={`/verify-certificate/${cert.certificateHash}`}
                  className="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Link</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
