import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse border border-slate-200/50 dark:border-slate-800/50">
      <div className="aspect-video bg-slate-300 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-5 w-5/6 bg-slate-300 dark:bg-slate-700 rounded" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="p-4 pt-0 flex justify-between items-center">
        <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
        <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" /></td>
    </tr>
  );
}
