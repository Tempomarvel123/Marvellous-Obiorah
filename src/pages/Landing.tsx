import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, BookOpen, Lock, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  return (
    <div className="bg-white text-zinc-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://picsum.photos/seed/students-studying-group/1920/1080" 
            alt="Students Reading" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4ff00] text-black text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>The Future of Academic Security</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              SECURE <span className="text-[#d4ff00]">VAULT</span> <br />
              FOR MODERN <br />
              ACADEMICS
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed"
            >
              A high-performance repository for lecturers to share materials and students to access them securely. Built for speed, security, and simplicity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#d4ff00] text-black font-black text-lg rounded-none hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                GET STARTED
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-black text-lg rounded-none hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                SIGN IN
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Badge as seen in image */}
        <div className="absolute right-10 bottom-10 hidden lg:block">
          <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center relative animate-spin-slow">
             <div className="absolute inset-0 flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-[#d4ff00] -rotate-45" />
             </div>
             <svg className="w-full h-full" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="text-[8px] font-bold fill-white uppercase tracking-[2px]">
                   <textPath xlinkHref="#circlePath">Leading Digital Academic Security • Since 2024 • </textPath>
                </text>
             </svg>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-[#d4ff00] py-4 overflow-hidden whitespace-nowrap border-y-2 border-black">
        <div className="flex animate-marquee items-center space-x-12">
          {[1,2,3,4,5].map((i) => (
            <React.Fragment key={i}>
              <span className="text-black font-black text-xl uppercase tracking-tighter flex items-center">
                <Zap className="w-5 h-5 mr-2 fill-current" /> SECURE UPLOADS
              </span>
              <span className="text-black font-black text-xl uppercase tracking-tighter flex items-center">
                <Zap className="w-5 h-5 mr-2 fill-current" /> ROLE-BASED ACCESS
              </span>
              <span className="text-black font-black text-xl uppercase tracking-tighter flex items-center">
                <Zap className="w-5 h-5 mr-2 fill-current" /> ENCRYPTED STORAGE
              </span>
              <span className="text-black font-black text-xl uppercase tracking-tighter flex items-center">
                <Zap className="w-5 h-5 mr-2 fill-current" /> INSTANT DOWNLOADS
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                ACADEMIC PROBLEMS <br />
                <span className="text-zinc-400">AND OUR BEST SOLUTIONS</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-12 leading-relaxed">
                We've built a system that bridges the gap between lecturers and students. No more lost emails or insecure file sharing. Everything is centralized, secure, and easy to manage.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-black text-[#d4ff00] rounded-none">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">Enterprise Security</h4>
                    <p className="text-zinc-500">JWT authentication and role-based access control ensure your data stays private.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-black text-[#d4ff00] rounded-none">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">Multi-Role Support</h4>
                    <p className="text-zinc-500">Tailored experiences for Admins, Lecturers, and Students.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://picsum.photos/seed/library-books/400/600" alt="Library Books" className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-black" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/university-campus/400/400" alt="University Campus" className="w-full h-40 object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-black" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4 pt-12">
                  <img src="https://picsum.photos/seed/students-working/400/400" alt="Students Working" className="w-full h-40 object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-black" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/academic-hall/400/600" alt="Academic Hall" className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-black" referrerPolicy="no-referrer" />
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#d4ff00] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Stats Grid */}
      <section className="py-24 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Explore our unique <br /> system services</h2>
            <div className="w-20 h-2 bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div className="bg-white p-10 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 group">
              <BookOpen className="w-10 h-10 mb-6 text-zinc-400 group-hover:text-[#d4ff00]" />
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Course Management</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400">Organize materials by level, semester, and course code with ease.</p>
            </div>
            <div className="bg-white p-10 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 group">
              <Shield className="w-10 h-10 mb-6 text-zinc-400 group-hover:text-[#d4ff00]" />
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Secure Downloads</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400">Authenticated download links prevent unauthorized access to materials.</p>
            </div>
            <div className="bg-white p-10 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 group">
              <Users className="w-10 h-10 mb-6 text-zinc-400 group-hover:text-[#d4ff00]" />
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Admin Control</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400">Full visibility and management of users and system resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Shield className="w-8 h-8 text-[#d4ff00]" />
            <span className="text-2xl font-black tracking-tighter uppercase">SecureVault</span>
          </div>
          <div className="flex space-x-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <span className="text-zinc-800">© 2024 SecureVault System</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
