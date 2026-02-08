import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'About', href: '#hero' }, // Mapping 'About' to Hero/Home for now or actual About if it exists
    { name: 'Tech Stack', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#journey' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Resumes', href: '#resumes' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle Scroll Effects and Active Link
  useEffect(() => {
    const handleScroll = () => {
      // 1. Toggle Navbar Background
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Scroll Spy
      const sections = document.querySelectorAll('section');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          currentSection = section.getAttribute('id');
        }
      });

      // Special case for top of page
      if (window.scrollY < 200) currentSection = 'hero'; 
      
      if (currentSection) setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
        const id = href.replace('#', '');
        setActiveLink(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // height of navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
  };

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        
        {/* Left: Logo */}
        <a href="#hero" className="brand-logo" onClick={(e) => handleLinkClick(e, '#hero')}>
          <div className="brand-circle">
            <span className="brand-initials">PM</span>
          </div>
          <div className="brand-glow"></div>
        </a>

        {/* Center: Desktop Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const linkId = link.href.replace('#', '');
            return (
              <a 
                key={link.name} 
                href={link.href}
                className={`nav-link ${activeLink === linkId ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Mobile Menu */}
        <div className="navbar-actions">
          <ThemeToggle />

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => {
             const linkId = link.href.replace('#', '');
             return (
              <a 
                key={link.name} 
                href={link.href}
                className={`mobile-link ${activeLink === linkId ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
