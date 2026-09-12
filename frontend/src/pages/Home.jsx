import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import {
  Server,
  Database,
  Globe,
  Palette,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const Home = () => {
  const stackFeatures = [
    {
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      title: 'React 19 & Vite 6',
      description:
        'Blazing fast Hot Module Replacement (HMR), optimized client bundling, and modular ES module architecture.',
    },
    {
      icon: <Palette className="w-6 h-6 text-sky-400" />,
      title: 'Tailwind CSS v4',
      description:
        'Modern CSS-first configuration using @tailwindcss/vite plugin with zero boilerplate config overhead.',
    },
    {
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      title: 'Express.js & ES Modules',
      description:
        'Scalable RESTful API architecture with native import/export statements, rate limiting, and CORS configuration.',
    },
    {
      icon: <Database className="w-6 h-6 text-green-400" />,
      title: 'MongoDB & Mongoose',
      description:
        'Elegant object modeling, automated schema validations, indexing, and connection lifecycle handlers.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: 'JWT & Bcrypt Security',
      description:
        'Complete authentication cycle with secure HTTP-only cookies, password salt hashing, and route protection.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
      title: 'Production Error Handling',
      description:
        'Centralized error middleware, custom ApiError/ApiResponse classes, and async controller wrappers.',
    },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8">
          <Layers className="w-3.5 h-3.5" />
          Production-Ready Architecture
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Scalable{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            MERN Stack
          </span>{' '}
          Starter
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
          Crafted with enterprise design patterns, Tailwind CSS v4, ES modules, and a clean
          layered backend. Ready for high-velocity full-stack engineering.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Explore Demo Auth <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              View Architecture
            </Button>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Engineered For Speed & Scale
          </h2>
          <p className="text-slate-400 text-sm">
            Everything structured neatly into modular components, controllers, and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackFeatures.map((item, idx) => (
            <Card key={idx} hover className="flex flex-col">
              <div className="p-3 w-fit rounded-lg bg-slate-800/80 mb-5 border border-slate-700/50">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Directory Blueprint Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Standardized File Structure
            </h2>
            <p className="text-slate-400 text-sm">
              Separation of concerns: clean division between controllers, services, database models,
              and UI layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Backend Tree */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
              <div className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                <Server className="w-4 h-4" /> backend/
              </div>
              <div>├── src/</div>
              <div className="pl-4">├── config/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# db.js, env.js</div>
              <div className="pl-4">├── controllers/ &nbsp;# auth.controller.js</div>
              <div className="pl-4">├── middlewares/ &nbsp;# auth, error handling</div>
              <div className="pl-4">├── models/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# user.model.js</div>
              <div className="pl-4">├── routes/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# auth, user routes</div>
              <div className="pl-4">├── services/ &nbsp;&nbsp;&nbsp;&nbsp;# business logic</div>
              <div className="pl-4">├── utils/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# apiError, apiResponse</div>
              <div className="pl-4">├── app.js &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# express setup</div>
              <div className="pl-4">└── server.js &nbsp;&nbsp;&nbsp;# entry point & DB connect</div>
              <div>├── .env.example</div>
              <div>└── package.json</div>
            </div>

            {/* Frontend Tree */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
              <div className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" /> frontend/
              </div>
              <div>├── src/</div>
              <div className="pl-4">├── components/ &nbsp;&nbsp;# common/, layout/</div>
              <div className="pl-4">├── context/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# AuthContext.jsx</div>
              <div className="pl-4">├── hooks/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# useAuth.js</div>
              <div className="pl-4">├── pages/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Home, Login, Register</div>
              <div className="pl-4">├── routes/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# AppRoutes, ProtectedRoute</div>
              <div className="pl-4">├── services/ &nbsp;&nbsp;&nbsp;&nbsp;# api.js, auth.service.js</div>
              <div className="pl-4">├── index.css &nbsp;&nbsp;&nbsp;&nbsp;# Tailwind CSS v4 (@import)</div>
              <div className="pl-4">└── App.jsx & main.jsx</div>
              <div>├── vite.config.js &nbsp;# @tailwindcss/vite plugin</div>
              <div>├── index.html</div>
              <div>└── package.json</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
