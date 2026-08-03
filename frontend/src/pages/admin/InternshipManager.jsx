import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Trash2, Edit2, Calendar, MapPin, DollarSign, BookOpen, User, Users, ClipboardList, Send, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function InternshipManager() {
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' | 'applications'
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loadingInternships, setLoadingInternships] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '3 Months (Remote)',
    requirements: '',
    skills: '',
    stipend: 'Unpaid',
    location: 'Remote',
    category: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInternships();
    fetchApplications();
  }, []);

  const fetchInternships = async () => {
    setLoadingInternships(true);
    try {
      const res = await api.get('/internships');
      setInternships(res.data.data.internships || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load internships.');
    } finally {
      setLoadingInternships(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const res = await api.get('/internships/applications');
      setApplications(res.data.data.applications || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications.');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingInternship(null);
    setForm({
      title: '',
      description: '',
      duration: '3 Months (Remote)',
      requirements: '',
      skills: '',
      stipend: 'Unpaid',
      location: 'Remote',
      category: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (internship) => {
    setEditingInternship(internship);
    setForm({
      title: internship.title || '',
      description: internship.description || '',
      duration: internship.duration || '3 Months (Remote)',
      requirements: internship.requirements || '',
      skills: internship.skills || '',
      stipend: internship.stipend || 'Unpaid',
      location: internship.location || 'Remote',
      category: internship.category || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship track?')) return;
    try {
      await api.delete(`/internships/${id}`);
      toast.success('Internship deleted successfully!');
      fetchInternships();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete internship.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Please enter a title and description.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingInternship) {
        await api.put(`/internships/${editingInternship.id || editingInternship._id}`, form);
        toast.success('Internship updated successfully!');
      } else {
        await api.post('/internships', form);
        toast.success('Internship posted successfully!');
      }
      setIsModalOpen(false);
      fetchInternships();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save internship.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/internships/applications/${appId}/status`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
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
            Internships Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Post new internship specialization domains and review enrolled student applications.
          </p>
        </div>
        <div>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Post Internship Track</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tracks'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Specialization Tracks ({internships.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Applications Directory ({applications.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'tracks' ? (
        loadingInternships ? (
          <div className="text-center py-12 text-slate-500">Loading internship tracks...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6">
            <Briefcase className="w-12 h-12 mx-auto text-slate-450 mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-350">No Internship tracks posted yet.</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-3 px-4 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/20"
            >
              Post your first track
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map((item) => (
              <div
                key={item.id || item._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition duration-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    {item.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-650" /> {item.duration}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-650" /> {item.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-650" /> {item.stipend}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/15 hover:text-amber-600 text-slate-600 dark:text-slate-350 transition"
                    title="Edit Track"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteInternship(item.id || item._id)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-600 text-slate-600 dark:text-slate-350 transition"
                    title="Delete Track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        loadingApplications ? (
          <div className="text-center py-12 text-slate-500">Loading student applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6">
            <ClipboardList className="w-12 h-12 mx-auto text-slate-450 mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-350">No applications received yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Student Details</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Track Applied</th>
                    <th className="p-4">Resume / Link</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id || app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{app.name}</div>
                        <div className="text-xs text-slate-500">{app.email}</div>
                        <div className="text-[11px] text-slate-400">{app.phone}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{app.college}</td>
                      <td className="p-4 font-bold text-slate-905 dark:text-amber-400">{app.domain}</td>
                      <td className="p-4">
                        {app.resumeLink ? (
                          <a
                            href={app.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-semibold text-xs transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Resume</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No Resume Link</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id || app._id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="applied">Applied</option>
                          <option value="review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Add / Edit Internship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {editingInternship ? 'Edit Internship Track' : 'Post New Internship Track'}
              </h3>
              <p className="text-xs text-slate-500">Provide domain requirements, skills, and mode details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Internship Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Machine Learning Research Intern"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Popular, Trending"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 3 Months (Remote)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={form.stipend}
                    onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                    placeholder="e.g. Unpaid, ₹5000/month"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Remote, Hyderabad"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Master standard cloud setups and server deployment workflows..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirements (comma separated)</label>
                <input
                  type="text"
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="Basic JavaScript, HTML/CSS knowledge, Git"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React & NextJS, REST APIs, Docker"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-sm text-slate-705"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 shadow-md hover:scale-[1.01] transition disabled:opacity-75 tracking-[0.2px]"
              >
                {submitting ? 'Saving track details...' : editingInternship ? 'Save Changes' : 'Publish Track'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
