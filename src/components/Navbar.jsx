import React, { useState, useEffect } from 'react';
import { getStoreData } from '../data/store';
const logoImg = '/images/logo.png';

export default function Navbar({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyEmail, setCompanyEmail] = useState(() => getStoreData().settings?.adminEmail || 'bizparkstudio@gmail.com');

  useEffect(() => {
    const handleStoreUpdate = () => {
      setCompanyEmail(getStoreData().settings?.adminEmail || 'bizparkstudio@gmail.com');
    };
    window.addEventListener('bizpark_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleStoreUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open & handle Esc key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
        return;
      }
      window.history.replaceState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'contact') {
      window.location.href = '/contact';
      return;
    }
    if (id === 'about') {
      window.location.href = '/about';
      return;
    }
    if (currentPage !== 'home') {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '', `/#${id}`);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-3 sm:py-3.5 border-white/10 shadow-lg shadow-black/60'
            : 'bg-[#0a0a0a]/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none py-3.5 sm:py-5 border-white/5 md:border-transparent'
        }`}
      >
        <div className="max-w-[1480px] 2xl:max-w-[1640px] mx-auto px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center justify-between gap-4">
            
            {/* Brand Logo & Name */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('top');
              }}
              className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 relative overflow-hidden rounded">
                <img
                  src={logoImg}
                  alt="bizparkstudio logo"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                <svg className="w-9 h-9 sm:w-11 sm:h-11 hidden" viewBox="0 0 100 100" fill="none">
                  <path d="M50 6 L94 44 L60 74 L60 44 L36 64 L36 90 L6 64 Z" fill="#F2603E" />
                  <path d="M50 26 L74 44 L36 90 L36 64 L60 44 Z" fill="#F5F4EF" />
                  <path d="M50 62 L60 74 L60 90 L50 82 Z" fill="#0a0a0a" />
                </svg>
              </div>
              <span className="font-chakra font-semibold text-base sm:text-lg tracking-wider text-white lowercase whitespace-nowrap">
                bizpark<span className="text-[#f2603e]">s</span>tudio
              </span>
            </a>

            {/* Desktop Nav Links (Visible on xl: 1280px+ to ensure zero overflow) */}
            <div className="hidden xl:flex items-center gap-7 2xl:gap-8 text-sm font-medium text-[#95928a]">
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                className="hover:text-white transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#process"
                onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}
                className="hover:text-white transition-colors duration-200"
              >
                Process
              </a>
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
                className="hover:text-white transition-colors duration-200"
              >
                Work
              </a>
              <a
                href="/products"
                className="hover:text-white transition-colors duration-200"
              >
                Products
              </a>
              <a
                href="#requirement-form"
                onClick={(e) => { e.preventDefault(); scrollToSection('requirement-form'); }}
                className="hover:text-white transition-colors duration-200"
              >
                Submit Requirement
              </a>
              <a
                href="/about"
                className={`transition-colors duration-200 ${currentPage === 'about' ? 'text-[#f2603e] font-bold' : 'hover:text-white'}`}
              >
                About
              </a>
              <a
                href="/contact"
                className={`transition-colors duration-200 ${currentPage === 'contact' ? 'text-[#f2603e] font-bold' : 'hover:text-white'}`}
              >
                Contact
              </a>
            </div>

            {/* Actions: Start a Project + Mobile Menu Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
              {/* "Start a Project" Button — Prominently visible on Tablets (>=640px) and Desktop */}
              <button
                onClick={() => scrollToSection('requirement-form')}
                className="hidden sm:inline-flex items-center gap-2 bg-[#f2603e] text-[#0a0a0a] font-chakra font-bold text-xs uppercase tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 transition-all duration-200 hover:bg-[#ff6f4a] hover:-translate-y-0.5 active:translate-y-0 cut-sm shadow-md shadow-[#f2603e]/20 whitespace-nowrap"
              >
                <span>Start a project</span>
                <span className="text-[11px]">→</span>
              </button>

              {/* Mobile / Tablet Menu Button (Visible below xl: 1280px) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden inline-flex items-center justify-center p-2 text-[#f5f4ef] hover:text-[#f2603e] hover:bg-white/10 rounded transition-colors focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE & TABLET OFF-CANVAS DRAWER MENU (HORIZONTALLY HALF) */}
      {/* ============================================================ */}

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[85%] sm:w-[58%] md:w-[46%] max-w-[390px] min-w-[280px] bg-[#0d0d0c] border-l border-white/15 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121211]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
              <img src={logoImg} alt="logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-chakra font-bold text-base tracking-wider text-white lowercase">
              bizpark<span className="text-[#f2603e]">s</span>tudio
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded bg-white/5 border border-white/10 text-[#95928a] hover:text-white hover:border-[#f2603e] hover:bg-[#f2603e]/10 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#95928a]">
            Navigation
          </div>

          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            className="flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium text-[#95928a] hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#f2603e] transition-colors" />
              <span>Services</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>

          <a
            href="#process"
            onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}
            className="flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium text-[#95928a] hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#f2603e] transition-colors" />
              <span>Process</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>

          <a
            href="#work"
            onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
            className="flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium text-[#95928a] hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#f2603e] transition-colors" />
              <span>Selected Work</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>

          <a
            href="/products"
            className="flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium text-[#95928a] hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#f2603e] transition-colors" />
              <span>Software &amp; Products</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>

          {/* Submit Requirement Highlighted */}
          <a
            href="#requirement-form"
            onClick={(e) => { e.preventDefault(); scrollToSection('requirement-form'); }}
            className="flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-semibold text-[#f2603e] bg-[#f2603e]/10 border border-[#f2603e]/30 hover:bg-[#f2603e]/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2603e] animate-pulse" />
              <span>Submit Requirement</span>
            </div>
            <span className="text-xs text-[#f2603e] font-mono">★</span>
          </a>

          <a
            href="/about"
            className={`flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium transition-all group ${
              currentPage === 'about'
                ? 'text-[#f2603e] bg-white/5 font-bold'
                : 'text-[#95928a] hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${currentPage === 'about' ? 'bg-[#f2603e]' : 'bg-white/20 group-hover:bg-[#f2603e]'} transition-colors`} />
              <span>About Studio</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>

          <a
            href="/contact"
            className={`flex items-center justify-between px-3.5 py-3 rounded text-sm sm:text-base font-medium transition-all group ${
              currentPage === 'contact'
                ? 'text-[#f2603e] bg-white/5 font-bold'
                : 'text-[#95928a] hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${currentPage === 'contact' ? 'bg-[#f2603e]' : 'bg-white/20 group-hover:bg-[#f2603e]'} transition-colors`} />
              <span>Contact Page</span>
            </div>
            <span className="text-xs text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
          </a>
        </div>

        {/* Drawer Bottom Action & Direct Contact Section */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121211] space-y-3.5">
          {/* Start Project CTA Button */}
          <button
            onClick={() => scrollToSection('requirement-form')}
            className="w-full bg-[#f2603e] hover:bg-[#ff6f4a] text-[#0a0a0a] font-chakra font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 cut-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f2603e]/20"
          >
            <span>Start a project</span>
            <span>→</span>
          </button>

          {/* Direct Contact Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#95928a]">
              <span>Direct Contact</span>
              <span className="text-[#25D366] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href="https://wa.me/94729545538?text=Hello%20Bizpark%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20services%21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#1a1a19] border border-white/10 hover:border-[#25D366] text-[#f5f4ef] hover:text-[#25D366] transition-colors rounded cut-sm"
              >
                <svg className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.477-.15-.678.15-.201.3-.778.979-.954 1.18-.176.201-.352.226-.653.075-1.516-.76-2.502-1.357-3.49-3.056-.263-.453.263-.42.753-1.402.083-.166.042-.312-.021-.437s-.678-1.633-.93-2.237c-.244-.588-.493-.509-.678-.518-.176-.008-.377-.01-.578-.01s-.527.075-.803.376c-.276.3-1.054 1.03-1.054 2.512s1.079 2.912 1.23 3.113c.151.2 2.124 3.242 5.145 4.548 2.053.888 2.859.957 3.885.803.623-.093 1.91-.78 2.181-1.534.271-.754.271-1.402.19-1.534-.08-.131-.281-.206-.582-.356z" />
                </svg>
                <span className="font-semibold">WhatsApp</span>
              </a>

              <a
                href="tel:+94729545538"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#1a1a19] border border-white/10 hover:border-[#f2603e] text-[#f5f4ef] hover:text-[#f2603e] transition-colors rounded cut-sm"
              >
                <svg className="w-3.5 h-3.5 text-[#f2603e] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>072 954 5538</span>
              </a>
            </div>

            {/* Social Links Row in Drawer */}
            <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/5">
              <a
                href="https://www.instagram.com/bizparkstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-[#1a1a19] border border-white/10 hover:border-[#f2603e] text-[#95928a] hover:text-[#f2603e] rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/bizparkstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-[#1a1a19] border border-white/10 hover:border-[#f2603e] text-[#95928a] hover:text-[#f2603e] rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/bizparkstudio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-[#1a1a19] border border-white/10 hover:border-[#f2603e] text-[#95928a] hover:text-[#f2603e] rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@bizpark_studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2 bg-[#1a1a19] border border-white/10 hover:border-[#f2603e] text-[#95928a] hover:text-[#f2603e] rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z" />
                </svg>
              </a>
            </div>

            <div className="text-center pt-0.5">
              <a
                href={`mailto:${companyEmail}`}
                className="text-[11px] text-[#95928a] hover:text-[#f2603e] font-mono transition-colors block truncate"
              >
                {companyEmail}
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
