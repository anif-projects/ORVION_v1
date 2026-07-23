import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function CommunityBoard() {
  const [discussions, setDiscussions] = useState([
    {
      id: 'd1',
      author: 'Alex Johnson',
      role: 'student',
      title: 'Best practice for structuring custom Mongoose repositories?',
      content: 'Should we export instantiated singletons like new UserRepository() or standard functions?',
      likes: 12,
      replies: [
        { author: 'Super Admin', role: 'admin', content: 'Exporting instantiated singletons guarantees clean dependency injection patterns.' },
      ],
    },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    const post = {
      id: Date.now().toString(),
      author: 'Alex Johnson',
      role: 'student',
      title: newTitle,
      content: newContent,
      likes: 0,
      replies: [],
    };
    setDiscussions([post, ...discussions]);
    setNewTitle('');
    setNewContent('');
    toast.success('Question published to community board!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Community Discussion Q&A</h1>
        <p className="text-sm text-slate-500 mt-1">Ask questions, share code insights, and get answers from instructors.</p>
      </div>

      {/* New Question Form */}
      <form onSubmit={handlePost} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Ask a Question</h3>
        <input
          type="text"
          placeholder="Topic or question title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
        />
        <textarea
          rows={3}
          placeholder="Describe your issue or code snippet..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
        />
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-primary-700 transition">
          <Send className="w-4 h-4" /> Post Question
        </button>
      </form>

      {/* Questions Feed */}
      <div className="space-y-4">
        {discussions.map((d) => (
          <div key={d.id} className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-600/20 text-primary-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {d.author.charAt(0)}
                </div>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-bold text-sm text-slate-800 dark:text-white truncate">{d.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 uppercase font-bold shrink-0">{d.role}</span>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 transition shrink-0">
                <ThumbsUp className="w-4 h-4" /> <span>{d.likes}</span>
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white break-words">{d.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">{d.content}</p>
            </div>

            {/* Replies */}
            {d.replies.length > 0 && (
              <div className="pl-4 border-l-2 border-primary-500/40 space-y-3 pt-2">
                {d.replies.map((r, idx) => (
                  <div key={idx} className="bg-slate-100/60 dark:bg-slate-800/60 p-3 rounded-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 dark:text-white">{r.author}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-600 uppercase font-bold">{r.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
