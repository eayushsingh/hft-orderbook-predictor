'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, CheckCircle2 } from 'lucide-react';

interface FAQAskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQAskQuestionModal: React.FC<FAQAskQuestionModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setQuestion('');
      setEmail('');
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1f1f2c]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1]">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Ask a Quantitative Support Question</h3>
                <p className="text-xs text-slate-500 dark:text-[#747888]">Our engine developers reply within 2 hours</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#161622] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Success State */}
          {isSubmitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Question Submitted Successfully!</h4>
              <p className="text-xs text-slate-500 dark:text-[#747888] max-w-xs mx-auto">
                Thank you! Our quant infrastructure team has received your query and will respond to <strong className="text-[#387ed1]">{email || 'your email'}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#14141e] border border-slate-300 dark:border-[#1f1f2c] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#387ed1]"
                >
                  <option value="general">General &amp; Platform</option>
                  <option value="terminal">L2 Terminal Engine</option>
                  <option value="robo">Robo-Advisor AI</option>
                  <option value="tax">Tax-Loss Harvesting</option>
                  <option value="brokers">Multi-Broker Gateway</option>
                  <option value="hft">HFT &amp; Co-Location</option>
                  <option value="compliance">Risk &amp; Compliance</option>
                  <option value="pricing">Pricing &amp; Billing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@quantdesk.com"
                  className="w-full bg-slate-50 dark:bg-[#14141e] border border-slate-300 dark:border-[#1f1f2c] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#387ed1]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Question or Technical Query:
                </label>
                <textarea
                  required
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your question regarding OBI signals, broker OAuth setup, or co-location hardware..."
                  className="w-full bg-slate-50 dark:bg-[#14141e] border border-slate-300 dark:border-[#1f1f2c] rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#387ed1]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#387ed1] hover:bg-[#306ec0] text-white flex items-center gap-2 shadow-lg shadow-[#387ed1]/20"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Question
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
