import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldAlert, ArrowRight, Mail, Lock } from 'lucide-react';
import orvionAuthBg from '../../assets/orvion_auth_bg.png';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, adminLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await adminLogin(email, password);
      toast.success('Access Granted. Welcome Admin!');
      if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
        navigate('/admin');
      } else {
        toast.error('Access denied. Admin role required.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${orvionAuthBg})` }}
    >
      {/* Light Warm Overlay (5-10% Opacity) */}
      <div className="absolute inset-0 bg-[#6b471c]/5 pointer-events-none" />

      {/* Background Ambient Shimmer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-full animate-bg-shimmer bg-gradient-to-r from-transparent via-amber-100/25 to-transparent" />
      </div>

      {/* Floating Ambient Light Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-2.5 h-2.5 rounded-full bg-amber-300/40 blur-[1px] animate-particle-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-3.5 h-3.5 rounded-full bg-amber-200/35 blur-[1px] animate-particle-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-yellow-200/40 blur-[1px] animate-particle-float" style={{ animationDelay: '6s' }} />
        <div className="absolute top-2/3 right-1/5 w-3 h-3 rounded-full bg-amber-400/30 blur-[1px] animate-particle-float" style={{ animationDelay: '9s' }} />
      </div>

      {/* Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] orvion-auth-card p-7 sm:p-9 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3d230d] via-[#8b5e2b] to-[#c98a2c] flex items-center justify-center text-white mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6 text-amber-100" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2e1c0c] tracking-tight">Admin Control Center</h2>
          <p className="text-xs text-[#5c3e21]/80 font-medium">Log in with your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b5e2b]/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lms.com"
                className="w-full pl-10 pr-4 py-3 text-sm orvion-auth-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b5e2b]/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-sm orvion-auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 orvion-brand-btn flex items-center justify-center gap-2 text-sm"
          >
            {loading ? 'Verifying...' : 'Access Console'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

