import { useEffect } from 'react';
import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import ResumeSection from './components/ResumeSection';
import Skills from './components/Skills';

function App() {
  
  // Mobile Scroll Reveal Effect
  useEffect(() => {
    let observer;

    const initObserver = () => {
      
      const options = {
        root: null,
        rootMargin: '-20% 0px -20% 0px', // Increased focus area (middle 60% of screen) for better trigger
        threshold: 0.15
      };

      observer = new IntersectionObserver((entries) => {
        // Dynamic check inside the callback so it works even if you resize/inspect without refresh
        const isMobile = window.innerWidth <= 1024;
        
        entries.forEach((entry) => {
          // If on desktop, remove the class to be safe and do nothing else
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

    // Small delay to ensure DOM elements are fully rendered
    const timeout = setTimeout(initObserver, 800);

    return () => {
      clearTimeout(timeout);
      if (observer) observer.disconnect();
    };
  }, []);

  // Application Main Component
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Achievements />
      <ResumeSection />
      <Contact />
      
      <footer style={{
        padding: '2rem 9%', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg-color)',
        color: 'var(--text-muted)'
      }}>
        <p>Copyright &copy; 2026 by Prakash | Built with React</p>
      </footer>
    </div>
  );
}

export default App;
