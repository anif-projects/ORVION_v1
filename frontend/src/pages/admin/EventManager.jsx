import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Plus, Trash2, UserCheck, Smartphone, Landmark, Save, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(true);
  
  // Modal State for posting new event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    thumbnail: '',
    paymentAmount: '',
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data.data.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load live events.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await api.get('/events/registrations');
      setRegistrations(res.data.data.registrations || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load event registrations.');
    } finally {
      setLoadingRegs(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEventImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading('Uploading event image...');
    try {
      const base64Data = await fileToBase64(file);
      const res = await api.post('/upload', { base64Data });
      if (res.data.status === 'success' && res.data.data.url) {
        setEventForm(prev => ({ ...prev, thumbnail: res.data.data.url }));
        toast.success('Event image uploaded successfully!', { id: loadingToast });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Using fallback.', { id: loadingToast });
      const eventFallbacks = [
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
      ];
      const fallback = eventFallbacks[Math.floor(Math.random() * eventFallbacks.length)];
      setEventForm(prev => ({ ...prev, thumbnail: fallback }));
    }
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.description) {
      toast.error('Please fill in required fields.');
      return;
    }

    setSubmittingEvent(true);
    try {
      await api.post('/events', {
        name: eventForm.name,
        description: eventForm.description,
        thumbnail: eventForm.thumbnail,
        paymentAmount: Number(eventForm.paymentAmount) || 0,
      });
      toast.success('Live Event Posted Successfully!');
      setEventForm({ name: '', description: '', thumbnail: '', paymentAmount: '' });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to post live event.');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event and all its registrants?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchEvents();
      fetchRegistrations();
    } catch (err) {
      toast.error('Failed to delete event.');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      {/* 1. Live Events Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Live Event Management</h1>
            <p className="text-sm text-slate-500 mt-1">Create, edit, and delete scheduled streams and webinars.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow flex items-center gap-2 text-xs hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" /> Post Live Event
          </button>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
          {loadingEvents ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading live events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No live events posted yet.</div>
          ) : (
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Fee (INR)</th>
                  <th className="px-6 py-4">Registrants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-primary-500" />
                        <span>{event.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {event.isPaymentEnabled ? `₹${event.paymentAmount}` : 'FREE'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {event.registrantCount || 0} enrolled
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 text-slate-400 hover:text-accent-danger transition"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 2. Event Registrants Table (Full Width) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Event Registrants</h2>
            <p className="text-xs text-slate-500">View enrolled students and check payment confirmations.</p>
          </div>
          <button onClick={fetchRegistrations} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
          {loadingRegs ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No registrations found.</div>
          ) : (
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">College / Organization</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-primary-500" /> {reg.name}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">{reg.email}</div>
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5" /> {reg.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {reg.eventId?.name || 'Deleted Event'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-secondary-500" /> {reg.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {reg.isPaid ? (
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-success/20 text-accent-success uppercase">
                            Paid
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">{reg.paymentId}</div>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
                          Free Seat
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Post Live Event Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            
            <div className="space-y-1 text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Post Live Event</h3>
              <p className="text-xs text-slate-500">Schedule a new stream, workshop or webinar</p>
            </div>

            <form onSubmit={handlePostEvent} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventForm.name}
                  onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. React 19 Hooks Masterclass"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this event about..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Thumbnail</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={eventForm.thumbnail}
                    onChange={(e) => setEventForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="Paste image URL or upload →"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <label className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200 transition shrink-0 select-none border border-slate-300/40 dark:border-slate-700/45">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Amount (INR - Optional)</label>
                <input
                  type="number"
                  value={eventForm.paymentAmount}
                  onChange={(e) => setEventForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                  placeholder="e.g. 499 (leave blank or 0 for FREE)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submittingEvent}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2 mt-4"
              >
                <Save className="w-4 h-4" /> {submittingEvent ? 'Posting...' : 'Post Live Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
