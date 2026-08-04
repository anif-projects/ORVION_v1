import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';
import api from '../../services/api';

export default function PlatformSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const loadToast = toast.loading('Creating administrator account...');
    try {
      await api.post('/admin/create-admin', { name, email, password });
      toast.success('🎉 Administrator account created successfully!', { id: loadToast });
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create administrator account.', { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Platform System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage administrator accounts and team logins.</p>
      </div>

      {/* Manage/Create Admin Credentials Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
          <Shield className="w-5 h-5" />
          <span>Create New Administrator Logins</span>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" /> Create Admin Login
          </button>
        </form>
      </div>
    </motion.div>
  );
}
