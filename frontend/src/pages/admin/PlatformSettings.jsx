import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Shield, CreditCard, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function PlatformSettings() {
  const [provider, setProvider] = useState('stripe');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Platform environment settings saved successfully!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Platform System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure SMTP credentials and Payment provider strategy.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Active Payment Strategy Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none font-semibold text-primary-600"
            >
              <option value="stripe">Stripe (USD Credit Cards & Checkout Sessions)</option>
              <option value="razorpay">Razorpay (INR UPI, Net Banking & Cards)</option>
              <option value="paypal">PayPal (Global Digital Wallet Integration)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">SMTP Gateway Host</label>
            <input
              type="text"
              defaultValue="smtp.mailtrap.io"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-primary-700 transition">
          <Save className="w-4 h-4" /> Save System Settings
        </button>
      </form>
    </motion.div>
  );
}
