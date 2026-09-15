import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import RequirementForm from './components/RequirementForm';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import CategoryProjects from './components/CategoryProjects';
import AdminPanel from './components/AdminPanel';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import WhatsAppButton from './components/WhatsAppButton';
import { syncFromBackend } from './data/store';

export default function App() {
  const [route, setRoute] = useState({ page: 'home', id: null });
  const [dataState, setDataState] = useState({ status: 'loading', error: '' });

  useEffect(() => {
    let isMounted = true;

    syncFromBackend().then((result) => {
      if (!isMounted) return;
      setDataState(result.success
        ? { status: 'ready', error: '' }
        : { status: 'error', error: result.error || 'Live site data could not be loaded.' });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (
        hash.startsWith('#software-') ||
        hash.startsWith('#project-contact') ||
        hash === '#software-projects-grid'
      ) {
        // In-page section anchor: smooth scroll without resetting page!
        const targetId = hash.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (hash.startsWith('#project-')) {
        const id = hash.replace('#project-', '');
        setRoute({ page: 'project', id });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        setRoute({ page: 'product', id });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#category-')) {
        const id = hash.replace('#category-', '');
        setRoute({ page: 'category', id });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#contact') {
        setRoute({ page: 'contact', id: null });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#about') {
        setRoute({ page: 'about', id: null });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#admin')) {
        setRoute({ page: 'admin', id: null });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setRoute({ page: 'home', id: null });
        if (hash) {
          const targetId = hash.slice(1);
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (route.page !== 'home') return;

    // Scroll reveal observer
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [route.page]);

  if (dataState.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f4ef] flex items-center justify-center px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[#f2603e]">Loading live content...</p>
      </div>
    );
  }

  if (dataState.status === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f4ef] flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#f2603e]">Live content unavailable</p>
          <p className="mt-3 text-sm text-[#aaa]">Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 border border-[#f2603e] px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#f2603e] hover:bg-[#f2603e] hover:text-[#0a0a0a]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f4ef] font-sans">
      <Navbar currentPage={route.page} />
      <main>
        {route.page === 'home' && (
          <>
            <Hero />
            <Marquee />
            <Services />
            <Process />
            <Work />
            <RequirementForm />
          </>
        )}
        {route.page === 'category' && <CategoryProjects categoryKey={route.id} />}
        {route.page === 'project' && <ProjectDetail projectId={route.id} />}
        {route.page === 'product' && <ProjectDetail projectId={route.id} />}
        {route.page === 'contact' && <ContactPage />}
        {route.page === 'about' && <AboutPage />}
        {route.page === 'admin' && <AdminPanel />}
      </main>
      <Footer currentPage={route.page} />
      <WhatsAppButton />
    </div>
  );
}
