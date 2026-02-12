import { motion } from 'framer-motion';
import { userData } from '../data';

const Hero = () => {  
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        
        {/* Left Column: Content */}
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          
          <div className="hero-status-badge">
            <span className="status-dot"></span>
            Available for opportunities
          </div>

          <h1 className="hero-title">
            Hi, I’m <br />
            <span className="highlight-text">{userData.name}</span>
          </h1>

          <div className="typing-container">
            <span className="typing-text">Full Stack Developer | Data Analyst</span>
            <span className="cursor">|</span>
          </div>

          <p className="hero-description">
            {userData.tagline}
            <br className="hidden-mobile"/> Passionately building scalable web applications with AI integration.
          </p>

          <div className="hero-socials">
            <a href={userData.socials.github} target="_blank" rel="noreferrer" className="hero-social-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href={userData.socials.linkedin} target="_blank" rel="noreferrer" className="hero-social-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href={userData.socials.instagram} target="_blank" rel="noreferrer" className="hero-social-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="btn-primary">View My Work</a>
            <a href="#resumes" className="btn-secondary">Resume</a>
          </div>
        
        </motion.div>

        {/* Right Column: Image */}
        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="profile-wrapper">
             {/* Using GitHub avatar as robust placeholder */}
            <img 
                src={`https://github.com/${userData.githubString}.png`} 
                alt={userData.name} 
                className="profile-img" 
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://ui-avatars.com/api/?name=Prakash+Mawliya&background=0D8ABC&color=fff&size=512";
                }}
            />
            <div className="profile-glow"></div>
            
            {/* Floating Badge */}
            <motion.div 
              className="floating-badge"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <span className="badge-icon">💻</span>
                Developer
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
