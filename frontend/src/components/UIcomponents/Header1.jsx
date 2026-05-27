import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';

const navItems = [
  { name: 'Pricing', href: '/pricing' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

export default function Header1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (isDark ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 z-50 border-b-2 transition-all duration-100 font-sans ${
        isScrolled 
          ? 'bg-[#FAFDEE]/90 dark:bg-[#0a111a]/90 border-[#1F3A4B]/20 dark:border-white/20 backdrop-blur-md shadow-xl' 
          : 'bg-transparent border-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brutalist Hard-Hitting Logo */}
          <div className="flex items-center">
            <Link to="/" className="group">
              <span className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-[#1F3A4B] dark:text-[#FAFDEE] group-hover:text-emerald-500 dark:group-hover:text-[#C2F84F] transition-colors duration-200">
                HEALTH<span className="text-emerald-600 dark:text-[#C2F84F]">HUB</span>
              </span>
            </Link>
          </div>

          {/* Nav Items - Fixed cross-route snap glitches cleanly */}
          <nav className="hidden items-center space-x-16 lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative text-lg md:text-xl font-bold tracking-wide transition-all duration-200 py-1 ${
                    isActive 
                      ? 'text-emerald-600 dark:text-[#C2F84F] opacity-100' 
                      : 'text-[#1F3A4B] dark:text-[#FAFDEE] opacity-75 hover:opacity-100 hover:text-emerald-600 dark:hover:text-[#C2F84F]'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div 
                      /* Removed layoutId to prevent un-mounted layout snap issues across full react route contexts */
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 dark:bg-[#C2F84F] rounded-full origin-left"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Interface Operations Block */}
          <div className="hidden items-center space-x-8 lg:flex">
            
            {/* Custom Theme Switch Slider */}
            <div 
              className="relative flex h-10 w-20 items-center rounded-full border border-[#1F3A4B]/20 dark:border-white/10 bg-[#1F3A4B]/5 dark:bg-white/5 overflow-hidden cursor-pointer shrink-0" 
              onClick={toggleTheme}
            >
              <div className={`absolute h-8 w-[2rem] rounded-full bg-[#476407] dark:bg-[#C2F84F] transition-all duration-300 ${theme === 'dark' ? 'translate-x-[2.7rem]' : 'translate-x-1'}`} />
              <span className="relative z-10 flex-1 flex items-center justify-center">
                <Sun size={14} className={theme === 'light' ? 'text-white' : 'text-gray-400'} />
              </span>
              <span className="relative z-10 flex-1 flex items-center justify-center">
                <Moon size={14} className={theme === 'dark' ? 'text-[#1F3A4B]' : 'text-gray-400'} />
              </span>
            </div>
            
            {/* Sign In */}
            <Link
              to="/login"
              className="text-base font-black tracking-wider uppercase text-[#1F3A4B] dark:text-[#FAFDEE] hover:text-emerald-600 dark:hover:text-[#C2F84F] transition-colors duration-200"
            >
              SIGN IN
            </Link>

            {/* Get Started */}
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2.5 rounded-2xl bg-[#1F3A4B] dark:bg-[#C2F84F] px-7 py-3.5 text-base font-black uppercase tracking-wider text-white dark:text-[#1F3A4B] border border-transparent dark:border-black/10 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <span>GET STARTED</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>

          {/* Mobile Access Trigger Block */}
          <div className="flex items-center space-x-4 lg:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-[#1F3A4B]/5 dark:bg-white/5 border border-[#1F3A4B]/10 dark:border-white/10 text-[#1F3A4B] dark:text-[#FAFDEE]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-[#C2F84F]" /> : <Moon className="h-5 w-5 text-[#1F3A4B]" />}
            </button>

            {/* Hamburger Button */}
            <button
              className="p-3 rounded-xl bg-[#1F3A4B] dark:bg-[#C2F84F] text-white dark:text-[#1F3A4B] shadow-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-20 left-0 right-0 h-screen lg:hidden z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay Glass Layer */}
            <div className="absolute inset-0 bg-[#FAFDEE]/98 dark:bg-[#0a111a]/98 backdrop-blur-xl border-t-2 border-[#1F3A4B]/10 dark:border-white/10" />
            
            <div className="relative z-10 p-6 flex flex-col space-y-5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block p-6 rounded-2xl border transition-all text-3xl font-extrabold tracking-tight ${
                      isActive 
                        ? 'bg-[#1F3A4B] text-[#C2F84F] dark:bg-[#C2F84F] dark:text-[#1F3A4B] border-transparent' 
                        : 'bg-[#1F3A4B]/5 dark:bg-white/5 border-[#1F3A4B]/10 text-[#1F3A4B] dark:text-[#FAFDEE] active:bg-[#1F3A4B] active:text-[#C2F84F]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-6 grid grid-cols-1 gap-4">
                <Link
                  to="/login"
                  className="w-full py-4.5 rounded-2xl border-2 border-[#1F3A4B] dark:border-white text-center text-sm sm:text-base font-black uppercase tracking-widest text-[#1F3A4B] dark:text-[#FAFDEE]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN IN
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-4.5 rounded-2xl bg-[#1F3A4B] dark:bg-[#C2F84F] text-center text-sm sm:text-base font-black uppercase tracking-widest text-white dark:text-[#1F3A4B]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  GET STARTED
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}