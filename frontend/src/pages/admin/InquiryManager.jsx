import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, User, Trash2, BookOpen, MapPin, MessageSquare, Clipboard } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      setInquiries(res.data.data.contactMessages || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Message deleted successfully.');
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message.');
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-200/50 dark:border-amber-900/30">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            Workspace Admin
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Get In Touch Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View details, questions, and inquiries submitted by potential students and visitors from the About Page.
          </p>
        </div>
      </div>

      {/* Main Table / Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-450 mb-3" />
          <p className="font-semibold text-slate-700 dark:text-slate-350">No contact inquiries received yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">Sender Details</th>
                  <th className="p-4">Background Info</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Message / Query</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-sm">
                {inquiries.map((inq) => (
                  <tr key={inq.id || inq._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span>{inq.fullName}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        <span>{inq.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        <span>{inq.mobile}</span>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      {inq.college ? (
                        <>
                          <div className="font-semibold text-slate-700 dark:text-slate-350">{inq.college}</div>
                          <div className="text-xs text-slate-500">{inq.branch} {inq.year && `(${inq.year})`}</div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Not provided</span>
                      )}
                    </td>
                    <td className="p-4">
                      {inq.address ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{inq.address}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                        {inq.message || <span className="text-slate-400 italic">No query message attached.</span>}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(inq.id || inq._id)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-600 text-slate-600 dark:text-slate-350 transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
