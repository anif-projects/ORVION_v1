import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { BookOpen, ArrowRight, Lock, Mail, KeyRound } from 'lucide-react';
import api from '../../services/api';
import orvionAuthBg from '../../assets/orvion_auth_bg.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

  // Forgot Password Wizard States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Logging in...');
    try {
      const loggedUser = await login(email, password);
      toast.success('Welcome back!', { id: loadingToast });
      if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setSendingOtp(true);
    const loadToast = toast.loading('Sending verification code...');
    try {
      await api.post('/auth/forgot-password', { email: resetEmail });
      toast.success('Verification OTP code sent to your email.', { id: loadToast });
      setResetStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.', { id: loadToast });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setResetting(true);
    const loadToast = toast.loading('Resetting password...');
    try {
      await api.post('/auth/reset-password', {
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      toast.success('Password reset completed successfully! Please log in.', { id: loadToast });
      setIsForgotPassword(false);
      setResetStep(1);
      setEmail(resetEmail);
      setResetEmail('');
      setResetOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed.', { id: loadToast });
    } finally {
      setResetting(false);
    }
  };

  // Stagger Animations for Form Items
  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15,
      },
    },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div className="flex-1 w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-screen -mt-[88px] pt-[88px]">
      {/* Background Image Container with One-Time Very Slow Zoom (1.02x, crisp background) */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${orvionAuthBg})` }}
      />

      {/* Light Warm Overlay (5-10% Opacity) */}
      <div className="absolute inset-0 bg-[#6b471c]/5 pointer-events-none" />

      {/* Glassmorphism Authentication Card with 0.65s Entrance & Mouse Move Effect */}
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
        {isForgotPassword ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-[#2e1c0c] tracking-tight">Reset Password</h2>
              <p className="text-xs text-[#5c3e21]/80 font-medium">
                {resetStep === 1 
                  ? 'Enter your registered email to receive a 6-digit OTP' 
                  : 'Enter the OTP and set your new password'}
              </p>
            </div>

            {resetStep === 1 ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-3.5 glass-btn-orange flex items-center justify-center gap-2 text-sm"
                >
                  {sendingOtp ? 'Sending OTP...' : 'Send Verification OTP'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3d230d] mb-1.5">6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 text-center font-mono text-base tracking-widest glass-input-premium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d230d] mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetting}
                  className="w-full py-3.5 glass-btn-orange flex items-center justify-center gap-2 text-sm"
                >
                  {resetting ? 'Resetting Password...' : 'Reset Password'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetStep(1);
                }}
                className="text-xs font-bold text-[#8A4B08] hover:text-[#C96A00] transition bg-transparent border-none cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-[#2e1c0c] tracking-tight">Welcome Back</h2>
              <p className="text-xs text-[#5c3e21]/80 font-medium">Log in to continue your learning journey</p>
            </div>

            {/* Staggered Form Elements */}
            <motion.form
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Item 1: Email */}
              <motion.div variants={formItemVariants}>
                <label className="block text-xs font-bold text-[#3d230d] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                  />
                </div>
              </motion.div>

              {/* Item 2: Password */}
              <motion.div variants={formItemVariants}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#3d230d]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setResetEmail(email);
                    }}
                    className="text-xs font-bold text-[#8A4B08] hover:text-[#C96A00] transition bg-transparent border-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A4B08]/70" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 text-sm glass-input-premium"
                  />
                </div>
              </motion.div>

              {/* Item 3: Button */}
              <motion.div variants={formItemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 glass-btn-orange flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Item 4: Signup Link Text */}
              <motion.div variants={formItemVariants} className="text-center text-xs font-medium text-[#5c3e21]/80 pt-1">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-[#8A4B08] hover:text-[#C96A00] hover:underline transition">
                  Sign up
                </Link>
              </motion.div>
            </motion.form>
          </div>
        )}
      </motion.div>
    </div>
  );
}



