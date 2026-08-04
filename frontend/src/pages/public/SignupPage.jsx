import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BookOpen, ShieldCheck, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import orvionAuthBg from '../../assets/orvion_auth_bg.png';

export default function SignupPage() {
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'student' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      setOtp('');
      toast.success(`Verification code successfully sent to ${formData.email}!`);
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: formData.email, otp });
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP code.');
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
        className="relative z-10 w-full max-w-[480px] orvion-auth-card p-7 sm:p-9 space-y-6 my-8"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3d230d] via-[#8b5e2b] to-[#c98a2c] flex items-center justify-center text-white mx-auto shadow-md">
            <BookOpen className="w-6 h-6 text-amber-100" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2e1c0c] tracking-tight">Create Account</h2>
          <p className="text-xs text-[#5c3e21]/80 font-medium">Join thousands of students building their future</p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b5e2b]/70" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Johnson"
                  className="w-full pl-10 pr-4 py-3 text-sm orvion-auth-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b5e2b]/70" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm orvion-auth-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b5e2b]/70" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              {loading ? 'Registering...' : 'Continue with OTP'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#3d230d] text-xs space-y-1 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#8b5e2b]" />
              <div>A 6-digit security code has been sent to <strong>{formData.email}</strong></div>
              <div className="text-[10px] text-[#5c3e21]/70">Please check your email inbox (and spam folder) for the code.</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3 text-center font-mono text-xl tracking-widest orvion-auth-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 orvion-brand-btn flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Complete Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs font-medium text-[#5c3e21]/80">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#8b5e2b] hover:text-[#3d230d] hover:underline transition">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

