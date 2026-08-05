import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  MessageSquare,
  User,
  Calendar,
  Award,
  Briefcase
} from 'lucide-react';

export default function Sidebar({ role = 'student' }) {
  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/my-courses', icon: BookOpen },
    { name: 'My Events', path: '/student/events', icon: Calendar },
    { name: 'Certifications', path: '/student/certifications', icon: Award },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Course Manager', path: '/admin/courses', icon: BookOpen },
    { name: 'Live Events', path: '/admin/events', icon: Calendar },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Internships', path: '/admin/internships', icon: Briefcase },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' || role === 'super_admin' ? adminLinks : studentLinks;

  return (
    <aside className="hidden md:flex w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-6rem)] p-4 flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role === 'admin' || role === 'super_admin' ? 'Admin Portal' : 'Student Menu'}
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
