import { motion } from 'framer-motion';
import { userData } from '../data';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrapper">
        
        {/* Header */}
        <div className="contact-header">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="heading"
          >
            Let's <span style={{ color: '#2563EB' }}>Connect</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="contact-subtitle"
          >
            I’m always open to discussing new projects, creative ideas, or opportunities
          </motion.p>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Info */}
          <motion.div 
            className="contact-info-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="status-badge">
              <span className="pulsing-dot"></span>
              Available for opportunities
            </div>

            <div className="info-items">
              <a href={`mailto:${userData.email}`} className="info-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
                <div>
                  <h4 className="info-label">Email</h4>
                  <p className="info-value">{userData.email}</p>
                </div>
              </a>

              <a href={`tel:+91${userData.phone}`} className="info-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>
                <div className="info-icon">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81 .7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4 className="info-label">Phone</h4>
                  <p className="info-value">+91 {userData.phone}</p>
                </div>
              </a>
              
              <a href={`https://www.google.com/maps/search/${userData.location}`} target="_blank" rel="noopener noreferrer" className="info-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h4 className="info-label">Location</h4>
                  <p className="info-value">{userData.location}</p>
                </div>
              </a>

              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h4 className="info-label">Response Time</h4>
                  <p className="info-value">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="social-links-row">
              <a href={userData.socials.github} target="_blank" rel="noopener noreferrer" className="social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href={userData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href={userData.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </motion.div>

          {/* Right Column: WhatsApp Call to Action */}
          <motion.div 
            className="contact-form-card" 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '300px' }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(37, 211, 102, 0.1)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              color: '#25D366'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
            </div>
            
            <h3 className="form-title" style={{ marginBottom: '0.5rem' }}>Chat on WhatsApp</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '300px' }}>
              Have a project in mind or just want to say hi? Connect with me directly on WhatsApp!
            </p>
            
            <a 
              href={`https://wa.me/91${userData.phone}?text=Hi%20Prakash,%20I%20saw%20your%20portfolio.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="submit-btn"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                backgroundColor: '#25D366', 
                border: 'none', 
                textDecoration: 'none',
                width: 'auto',
                padding: '1rem 2.5rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path></svg>
              <span>Message Me</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
