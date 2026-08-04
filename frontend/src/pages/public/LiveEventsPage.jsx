import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, Users, ShieldAlert, Radio, DollarSign, Ticket, CalendarCheck, Loader2 } from 'lucide-react';
import { pageVariants } from '../../utils/animations';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import EventGallerySection from '../../components/live-hub/EventGallerySection';

export default function LiveEventsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReservedSuccess, setIsReservedSuccess] = useState(false);
  
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

  useEffect(() => {
    if (location.hash === '#highlights') {
      const el = document.getElementById('highlights');
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash, loading]);

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

    setIsSubmitting(true);
    setIsReservedSuccess(false);

    if (selectedEvent.isPaymentEnabled && selectedEvent.paymentAmount > 0) {
      try {
        const res = await api.post('/payments/checkout', {
          type: 'event',
          id: selectedEvent._id
        });
        
        const { isPaid, orderId, amount, currency, keyId, message } = res.data.data;

        if (!isPaid) {
          setIsSubmitting(false);
          setIsReservedSuccess(true);
          toast.success(message || '✅ Reserved Successfully!');
          setTimeout(() => {
            setSelectedEvent(null);
            setIsReservedSuccess(false);
            setFormData(prev => ({ ...prev, organization: '', agreedToTerms: false }));
          }, 1200);
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setIsSubmitting(false);
          toast.error('Failed to load Razorpay Payment Gateway. Check connection.');
          return;
        }

        const options = {
          key: keyId,
          amount: amount, // in paise
          currency: currency || 'INR',
          name: 'Orvion Edu Tech',
          description: `Enrollment: ${selectedEvent.name}`,
          order_id: orderId,
          handler: async function (response) {
            try {
              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: 'event',
                itemId: selectedEvent._id
              });
              setIsSubmitting(false);
              setIsReservedSuccess(true);
              toast.success('✅ Payment Verified & Registered Successfully!');
              setTimeout(() => {
                setSelectedEvent(null);
                setIsReservedSuccess(false);
                setFormData(prev => ({ ...prev, organization: '', agreedToTerms: false }));
              }, 1200);
            } catch (err) {
              setIsSubmitting(false);
              toast.error(err.response?.data?.message || 'Payment verification failed. Contact support.');
            }
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
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
      } catch (err) {
        setIsSubmitting(false);
        toast.error(err.response?.data?.message || 'Checkout initialization failed');
      }
    } else {
      // Free Event
      try {
        await api.post(`/events/${selectedEvent._id}/register`, {
          ...formData,
          isPaid: false,
          paymentId: null,
        });
        setIsSubmitting(false);
        setIsReservedSuccess(true);
        toast.success('✅ Reserved Successfully!');
        setTimeout(() => {
          setSelectedEvent(null);
          setIsReservedSuccess(false);
          setFormData(prev => ({ ...prev, organization: '', agreedToTerms: false }));
        }, 1200);
      } catch (err) {
        setIsSubmitting(false);
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
      className="w-full min-h-screen"
    >
      {/* Top Container: Header & Upcoming Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary-500/30 text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.18em]"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span>ORVION LIVE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Tech Events & <span className="gradient-text">Experiences</span>
          </motion.h1>
        </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">Loading live events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-semibold">No live events scheduled at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={event.thumbnail || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'}
                    alt={event.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={() => {
                  if (!user) {
                    toast.error('Please log in to reserve your place');
                    return;
                  }
                  setSelectedEvent(event);
                }}
                className="group/btn w-full py-3 rounded-full font-bold text-xs text-white bg-gradient-to-r from-primary-600 via-orange-600 to-primary-700 shadow-glow hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer tracking-[0.2px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <Ticket className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-200" />
                <span>Reserve Your Place</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
      </div>



      {/* SECTION 2 — EVENT GALLERY WITH LIGHTBOX */}
      <EventGallerySection />

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
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 via-orange-600 to-primary-700 shadow-glow hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed tracking-[0.2px] focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Reserving...</span>
                  </>
                ) : isReservedSuccess ? (
                  <span>✅ Reserved Successfully</span>
                ) : selectedEvent.isPaymentEnabled ? (
                  `Pay ₹${selectedEvent.paymentAmount} & Reserve`
                ) : (
                  'Reserve Your Place'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
