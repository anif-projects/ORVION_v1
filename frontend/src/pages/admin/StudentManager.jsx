import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Ban, CheckCircle, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.data.users || []);
    } catch (err) {
      console.error(err);
      setStudents([
        { _id: 'u1', name: 'Alex Johnson', email: 'student@lms.com', role: 'student', status: 'active', createdAt: '2026-07-01' },
        { _id: 'u2', name: 'Maria Garcia', email: 'maria@example.com', role: 'student', status: 'active', createdAt: '2026-07-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await api.patch(`/admin/students/${id}/status`, { status: nextStatus });
      setStudents(students.map((s) => (s._id === id ? { ...s, status: nextStatus } : s)));
      toast.success(`Student status updated to ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Student Management Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Audit student profiles, manage block states, and view enrollment logs.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.name}</td>
                <td className="px-6 py-4 text-slate-500">{s.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${s.status === 'active' ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-danger/20 text-accent-danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleStatus(s._id, s.status)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    {s.status === 'active' ? 'Block Access' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
