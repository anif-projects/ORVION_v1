import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, Users, ShieldAlert, Radio, DollarSign } from 'lucide-react';
import { pageVariants } from '../../utils/animations';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function LiveEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    organization: '',
    agreedToTerms: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to register for events.');
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    if (selectedEvent.isPaymentEnabled && selectedEvent.paymentAmount > 0) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay Payment Gateway. Check connection.');
        return;
      }

      const options = {
        key: 'rzp_test_mockkey_123', // Test API Key
        amount: Math.round(selectedEvent.paymentAmount * 100), // in Paisa
        currency: 'INR',
        name: 'Orvion Edu Tech',
        description: `Enrollment: ${selectedEvent.name}`,
        handler: async function (response) {
          try {
            await api.post(`/events/${selectedEvent._id}/register`, {
              ...formData,
              isPaid: true,
              paymentId: response.razorpay_payment_id || `MOCK-PAY-${Date.now()}`,
            });
            toast.success('Registration & Payment Successful!');
            setSelectedEvent(null);
            setFormData(prev => ({ ...prev, organization: '', agreedToTerms: false }));
          } catch (err) {
            toast.error('Registration failed after payment. Contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Free Event
      try {
        await api.post(`/events/${selectedEvent._id}/register`, {
          ...formData,
          isPaid: false,
          paymentId: null,
        });
        toast.success('Registration Successful!');
        setSelectedEvent(null);
        setFormData(prev => ({ ...prev, organization: '', agreedToTerms: false }));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to register.');
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-secondary-500/30 text-xs font-semibold text-secondary-600 dark:text-secondary-400">
          <Radio className="w-4 h-4 text-accent-danger animate-pulse" />
          <span>Interactive Live Streams & Workshops</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Events & <span className="gradient-text">Webinars</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Join live code-alongs, Q&A sessions with senior engineers, and technology deep dives.
        </p>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">Loading live events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-semibold">No live events scheduled at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={event.thumbnail || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-full text-white bg-primary-600/90 shadow-sm">
                    {event.isPaymentEnabled ? `₹${event.paymentAmount}` : 'FREE'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {event.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please log in to register for live events');
                    return;
                  }
                  setSelectedEvent(event);
                }}
                className="w-full py-3 rounded-full font-bold text-xs text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" /> Enroll for Event
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal Form */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Register for Event</h3>
              <p className="text-xs text-slate-500">{selectedEvent.name}</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">College / Organization</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g. IIT Madras / Google"
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  required
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <label htmlFor="agree-checkbox" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                  I agree to the terms and conditions of this event.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2 mt-4"
              >
                {selectedEvent.isPaymentEnabled ? `Pay ₹${selectedEvent.paymentAmount} & Submit` : 'Register For Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
