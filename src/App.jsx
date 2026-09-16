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
  const [dataState, setDataState] = useState({ status: 'ready', error: '' });

  useEffect(() => {
    const pageSeo = {
      home: {
        title: 'Bizpark Studio | Web Development, Digital Marketing & Branding',
        description: 'Bizpark Studio helps growing businesses with web development, social media marketing, branding, and digital solutions from one accountable team.',
      },
      about: {
        title: 'About Bizpark Studio | Digital Solutions Team',
        description: 'Meet Bizpark Studio, a Sri Lankan team combining software development, marketing, and branding for growing businesses.',
      },
      contact: {
        title: 'Contact Bizpark Studio | Start Your Project',
        description: 'Contact Bizpark Studio for web development, digital marketing, branding, and custom software solutions in Sri Lanka.',
      },
      category: {
        title: 'Our Work | Bizpark Studio Projects',
        description: 'Explore selected web development, branding, and digital projects by Bizpark Studio.',
      },
      project: {
        title: 'Project Case Study | Bizpark Studio',
        description: 'Explore a Bizpark Studio project case study, including the approach, deliverables, and technology used.',
      },
      product: {
        title: 'Digital Product | Bizpark Studio',
        description: 'Explore a digital product created by Bizpark Studio for modern businesses.',
      },
      admin: {
        title: 'Admin | Bizpark Studio',
        description: 'Bizpark Studio administration panel.',
      },
    };

    const seo = pageSeo[route.page] || pageSeo.home;
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}${window.location.pathname}`;

    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', route.page === 'admin' ? 'noindex, nofollow' : 'index, follow');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);

    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Bizpark Studio',
        url: siteUrl,
        logo: `${siteUrl}/images/logo.png`,
        description: 'Web development, social media marketing, and branding studio for growing businesses.',
        areaServed: 'Sri Lanka',
        sameAs: [],
      });
    }
  }, [route]);

  useEffect(() => {
    let isMounted = true;

    // Gracefully sync from backend in background; seamlessly fallback to store data
    syncFromBackend()
      .then(() => {
        if (isMounted) setDataState({ status: 'ready', error: '' });
      })
      .catch((err) => {
        console.warn('Backend sync deferred to local/seed store data:', err.message);
        if (isMounted) setDataState({ status: 'ready', error: '' });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname.replace(/\/$/, '') || '/';
      if (pathname === '/about' || pathname === '/contact' || pathname === '/products') {
        const page = pathname.slice(1);
        setRoute(page === 'products' ? { page: 'category', id: 'software-solutions' } : { page, id: null });
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

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

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
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
      <div className="brand-loader min-h-screen bg-[#0a0a0a] text-[#f5f4ef] flex items-center justify-center px-6">
        <div className="brand-loader__wordmark" aria-label="Bizpark Studio">
          {'BIZPARK STUDIO'.split('').map((letter, index) => (
            <span
              className={letter === ' ' ? 'brand-loader__space' : 'brand-loader__letter'}
              key={`${letter}-${index}`}
              style={{ '--letter-delay': `${index * 0.09}s` }}
              aria-hidden="true"
            >
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
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
