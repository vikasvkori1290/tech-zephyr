import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { HelpCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-6">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
      <p className="text-lg text-slate-300 font-medium mb-1">Page Not Found</p>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};
