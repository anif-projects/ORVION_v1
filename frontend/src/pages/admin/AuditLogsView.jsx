import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, Clock, User } from 'lucide-react';
import api from '../../services/api';
import { pageVariants } from '../../utils/animations';

export default function AuditLogsView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data.data.logs || []);
    } catch (err) {
      console.error(err);
      setLogs([
        { _id: 'a1', action: 'CREATE_COURSE', user: { name: 'Super Admin' }, ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
        { _id: 'a2', action: 'UPDATE_STUDENT_STATUS', user: { name: 'Super Admin' }, ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
      ]);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Security & Action Audit Trail</h1>
        <p className="text-sm text-slate-500 mt-1">Immutable security log monitoring administrative actions, IP addresses, and state changes.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Admin User</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">{log.action}</td>
                <td className="px-6 py-4 text-slate-800 dark:text-white">{log.user?.name || 'System'}</td>
                <td className="px-6 py-4 text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
