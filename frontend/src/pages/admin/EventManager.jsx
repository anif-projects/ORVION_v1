import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Plus, Trash2, UserCheck, Smartphone, Landmark, Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function EventManager() {
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'gallery'
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

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
    fetchGallery();
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

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await api.get('/gallery');
      setGalleryImages(res.data.data.images || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load gallery images.');
    } finally {
      setLoadingGallery(false);
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

    const loadingToast = toast.loading('Reading event image...');
    try {
      const base64Data = await fileToBase64(file);
      setEventForm(prev => ({ ...prev, thumbnail: base64Data }));
      toast.success('Event image uploaded successfully!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to read event image.', { id: loadingToast });
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

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading('Uploading highlights image...');
    try {
      const base64Data = await fileToBase64(file);
      await api.post('/gallery', { url: base64Data });
      toast.success('Highlights image uploaded successfully!', { id: loadingToast });
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image.', { id: loadingToast });
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this highlight image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Highlight image deleted successfully!');
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete highlight image.');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-200/50 dark:border-amber-900/30">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            Workspace Admin
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Live Events & Gallery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Schedule live events, webinars and manage moments that matter on the public Live Hub.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sessions'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live Sessions ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Highlights ({galleryImages.length})</span>
        </button>
      </div>

      {activeTab === 'sessions' ? (
        <div className="space-y-8">
          {/* Live Events Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Scheduled Events</h2>
                <p className="text-xs text-slate-500 mt-1">Create, edit, and delete scheduled streams and webinars.</p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 shadow-glow flex items-center gap-2 text-xs hover:scale-105 transition"
              >
                <Plus className="w-4 h-4" /> Post Live Event
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                {loadingEvents ? (
                  <div className="text-center py-12 text-slate-500 text-sm">Loading live events...</div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No live events posted yet.</div>
                ) : (
                  <table className="w-full min-w-[700px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-850/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">Event Name</th>
                        <th className="px-6 py-4">Fee (INR)</th>
                        <th className="px-6 py-4">Registrants</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                      {events.map((event) => (
                        <tr key={event.id || event._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                            <div className="flex items-center gap-3">
                              <Video className="w-4 h-4 text-amber-600" />
                              <span>{event.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                            {event.isPaymentEnabled ? `₹${event.paymentAmount}` : 'FREE'}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            {event.registrantCount || 0} enrolled
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteEvent(event.id || event._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 transition"
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
          </div>

          {/* Event Registrants Table (Full Width) */}
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

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                {loadingRegs ? (
                  <div className="text-center py-12 text-slate-500 text-sm">Loading registrations...</div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No registrations found.</div>
                ) : (
                  <table className="w-full min-w-[700px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-850/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">Student Details</th>
                        <th className="px-6 py-4">Event Name</th>
                        <th className="px-6 py-4">College / Organization</th>
                        <th className="px-6 py-4">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                      {registrations.map((reg) => (
                        <tr key={reg.id || reg._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition">
                          <td className="px-6 py-4 space-y-1">
                            <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-amber-600" /> {reg.name}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">{reg.email}</div>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5" /> {reg.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                            {reg.eventId?.name || 'Deleted Event'}
                          </td>
                          <td className="px-6 py-4 text-slate-605 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Landmark className="w-4 h-4 text-blue-600" /> {reg.organization}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {reg.isPaid ? (
                              <div className="space-y-1">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
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
          </div>
        </div>
      ) : (
        /* Tab 2: Gallery Moments highlights management */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Moments Gallery Manager</h2>
              <p className="text-xs text-slate-500 mt-1">Upload and delete images displayed in the "Moments That Matter" gallery section.</p>
            </div>
            
            <label className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 shadow-glow flex items-center gap-2 text-xs hover:scale-105 transition cursor-pointer">
              <Plus className="w-4 h-4" /> Upload Moment
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </label>
          </div>

          {loadingGallery ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading gallery images...</div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-500">
              No gallery moments uploaded yet. Post one to showcase student activities!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((img) => (
                <div
                  key={img.id || img._id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition duration-200 aspect-video"
                >
                  <img
                    src={img.url}
                    alt="Gallery Highlight"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDeleteGallery(img.id || img._id)}
                      className="p-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow transition-transform duration-200 hover:scale-110"
                      title="Delete Moment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Live Event Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl">
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
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2 mt-4"
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
