import React from 'react';
import { Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-200">Tech Zephyr</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">MERN Stack Architecture</span>
        </div>

        <p className="text-xs text-slate-500">
          Built with MongoDB, Express, React, Node.js & Tailwind CSS v4.
        </p>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-200 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-200 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-200 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
