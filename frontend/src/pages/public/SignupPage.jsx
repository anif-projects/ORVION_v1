import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import orvionAuthBg from '../../assets/orvion_auth_bg.png';

export default function SignupPage() {
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'student' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mouse Movement Effect (Subtle 3-5px translation)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 200, damping: 25 });
  const mouseY = useSpring(rawY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = ((e.clientX - centerX) / (rect.width / 2)) * 4; // max ±4px
    const offsetY = ((e.clientY - centerY) / (rect.height / 2)) * 4;
    rawX.set(offsetX);
    rawY.set(offsetY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Sending verification OTP...');
    try {
      await api.post('/auth/register', formData);
      setOtp('');
      toast.success(`Verification code sent to ${formData.email}!`, { id: loadingToast });
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Verifying code...');
    try {
      await api.post('/auth/verify-otp', { email: formData.email, otp });
      toast.success('Email verified! You can now log in.', { id: loadingToast });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP code.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-screen -mt-[88px] pt-[88px]">
      {/* Background Image Container with One-Time Very Slow Zoom */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${orvionAuthBg})` }}
      />

      {/* Light Warm Overlay (5-10% Opacity) */}
      <div className="absolute inset-0 bg-[#6b471c]/5 pointer-events-none" />

      {/* Glassmorphism Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          x: mouseX,
          y: mouseY,
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255, 255, 255, 0.28)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 30px rgba(255, 170, 60, 0.10)',
          borderRadius: '32px',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-[90%] sm:w-full max-w-[480px] p-7 sm:p-9 space-y-6 mt-14 sm:mt-16"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#2e1c0c] tracking-tight">Create Account</h2>
          <p className="text-xs text-[#5c3e21]/80 font-medium">Join thousands of students building their future</p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Johnson"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-btn-orange flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Registering...' : 'Continue with OTP'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#3d230d] text-xs space-y-1 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#8A4B08]" />
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
                className="w-full px-4 py-3 text-center font-mono text-xl tracking-widest glass-input-premium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-btn-orange flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Complete Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs font-medium text-[#5c3e21]/80">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#8A4B08] hover:text-[#C96A00] hover:underline transition">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
