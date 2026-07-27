import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, CheckCircle2, User, HelpCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function MyEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/events'),
        api.get('/events/my-events')
      ]);
      setAllEvents(allRes.data.data.events || []);
      setMyEvents(myRes.data.data.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load events.');
      // Mock fallback
      const mockEvents = [
        {
          _id: 'ev1',
          title: 'Full-Stack Performance Tuning & Optimization',
          description: 'Learn how to profile database queries, optimize React rendering, and configure Redis caching for production workloads.',
          instructor: 'Super Admin',
          startTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
          endTime: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
          meetingLink: 'https://zoom.us/j/1234567890',
          capacity: 100,
          registeredUsers: []
        },
        {
          _id: 'ev2',
          title: 'Clean Architecture with Node.js & MySQL',
          description: 'A deep-dive session on controllers, repository patterns, decoupling dependencies, and implementing secure database migration strategies.',
          instructor: 'Super Admin',
          startTime: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days later
          endTime: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(),
          meetingLink: 'https://zoom.us/j/0987654321',
          capacity: 50,
          registeredUsers: []
        }
      ];
      setAllEvents(mockEvents);
      setMyEvents([mockEvents[0]]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      if (res.data.status === 'success') {
        toast.success(res.data.message || 'Successfully registered for event!');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to register for the event.');
    }
  };

  const isRegistered = (eventId) => {
    return myEvents.some(event => event._id === eventId);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Live Events Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Register for upcoming live lectures, webinars, and study rooms.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading events...</div>
      ) : (
        <div className="space-y-8">
          {/* My Registered Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> My Registered Sessions
            </h2>
            
            {myEvents.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-sm text-slate-500 max-w-lg">
                You have not registered for any upcoming live events. See below to explore and register for live events!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map((event) => (
                  <div key={event._id} className="glass-card p-5 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 space-y-4 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Registered
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-800 dark:text-white text-base">{event.name || event.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>Date: {new Date(event.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>Time: {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span>Instructor: {event.instructor || 'Host'}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={event.meetingLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Live Zoom Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Explore Upcoming Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" /> Explore Live Seminars & Events
            </h2>

            {allEvents.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-sm text-slate-500">
                No upcoming events scheduled at this moment. Please check back later.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allEvents.filter(event => !isRegistered(event._id)).map((event) => (
                  <div key={event._id} className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 flex flex-col justify-between hover:shadow-md transition">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-800 dark:text-white text-base line-clamp-1">{event.name || event.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-600" />
                        <span>Date: {new Date(event.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span>Time: {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-600" />
                        <span>Instructor: {event.instructor || 'Host'}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleRegister(event._id)}
                        className="w-full h-9 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <span>Register for Event</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
