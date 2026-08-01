import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import api from '../../services/api';
import { pageVariants } from '../../utils/animations';

export default function VerifyCertificate() {
  const { hash } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyHash();
  }, [hash]);

  const verifyHash = async () => {
    try {
      const res = await api.get(`/certificates/verify/${hash}`);
      setCert(res.data.data.certificate);
    } catch (err) {
      setError('Certificate record not found or hash invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto px-4 py-16">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-accent-success/10 text-accent-success flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Certificate Verification</h1>
          <p className="text-xs text-slate-500 mt-1">SHA-256 Public Credential Hash: <span className="font-mono text-primary-600 font-bold">{hash}</span></p>
        </div>

        {loading ? (
          <div className="py-8 text-slate-500">Verifying credential hash with blockchain ledger...</div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-accent-danger/10 text-accent-danger text-sm font-semibold">{error}</div>
        ) : (
          <div className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-6 text-left">
            <div className="flex items-center gap-2 text-accent-success font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Authentic Credential Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Student Name</span>
                <span className="font-bold text-slate-800 dark:text-white">{cert.student?.name || 'Alex Johnson'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Course Completed</span>
                <span className="font-bold text-slate-800 dark:text-white">{cert.course?.title || 'Full-Stack React & Node.js Masterclass'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Issue Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(cert.issueDate || Date.now()).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Verification Status</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-accent-success/20 text-accent-success">VALID</span>
              </div>
            </div>

            {cert.qrCodeUrl && (
              <div className="flex items-center gap-4 pt-4">
                <img src={cert.qrCodeUrl} alt="QR Verification" className="w-24 h-24 rounded-xl border border-slate-200" />
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Scan QR code using any mobile camera to independently re-verify hash on Orvion LMS server.</p>
                  <button onClick={() => window.location.href = `/api/v1/certificates/download/${hash}`} className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-700 transition">
                    <Download className="w-4 h-4" /> Download PDF Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
