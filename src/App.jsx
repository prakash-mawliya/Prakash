import { useEffect } from 'react';
import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Cursor from './components/Cursor';
import FunZone from './components/FunZone';
import Hero from './components/Hero';
import Hobbies from './components/Hobbies';
import Journey from './components/Journey';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import ResumeSection from './components/ResumeSection';
import ScrollProgress from './components/ScrollProgress';
import Skills from './components/Skills';

function App() {
  
  // Mobile Scroll Reveal Effect
  useEffect(() => {
    let observer;

    const initObserver = () => {
      
      const options = {
        root: null,
        rootMargin: '-20% 0px -20% 0px', 
        threshold: 0.15
      };

      observer = new IntersectionObserver((entries) => {
        const isMobile = window.innerWidth <= 1024;
        
        entries.forEach((entry) => {
          if (!isMobile) {
            entry.target.classList.remove('mobile-hover');
            return;
          }

          if (entry.isIntersecting) {
            entry.target.classList.add('mobile-hover');
          } else {
            entry.target.classList.remove('mobile-hover');
          }
        });
      }, options);

      const selectors = [
        '.stat-card-v2',
        '.project-card',
        '.tool-card',
        '.tech-card',
        '.timeline-item',
        '.timeline-card', 
        '.achievement-card',
        '.contact-info-card',
        '.social-btn'
      ];

      const elements = document.querySelectorAll(selectors.join(', '));
      elements.forEach((el) => observer.observe(el));
    };

    const timeout = setTimeout(initObserver, 800);

    return () => {
      clearTimeout(timeout);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Achievements />
      <FunZone />
      <Hobbies />
      <ResumeSection />
      <Contact />
      
      <footer style={{
        padding: '2rem 9%', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg-color)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <p>© 2026 Prakash. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
