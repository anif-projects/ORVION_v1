import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { pageVariants } from '../../utils/animations';

export default function StudentProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data.data) {
        setName(res.data.data.name || '');
        setEmail(res.data.data.email || '');
        setPhone(res.data.data.phone || '');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch profile details.');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', { name, phone });
      if (res.data.status === 'success') {
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  if (fetching) {
    return <div className="text-center py-12 text-slate-500">Loading profile details...</div>;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your public bio, credentials, and settings.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {name.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name}</h3>
            <p className="text-xs text-slate-500 capitalize">Role: {user?.role || 'student'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-primary-700 transition shadow-md">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>
    </motion.div>
  );
}
