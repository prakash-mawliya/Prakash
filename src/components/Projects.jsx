import { motion } from 'framer-motion';
import { userData } from '../data';

const Projects = () => {
  // Stagger animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for each project card
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section className="portfolio" id="projects">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="heading"
      >
        Featured <span>Projects</span>
      </motion.h2>

      <motion.div 
        className="project-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {userData.projects.map((project) => (
          <motion.div 
            className="project-card-v2" 
            key={project.id}
            variants={cardVariants}
            whileHover={{ y: -5 }}
          >
             {/* Image & Floating Actions */}
             <div className="project-img-container">
                <div 
                  className="project-img" 
                  style={{backgroundImage: `url(${project.imageUrl || 'https://via.placeholder.com/400'})`}}
                ></div>
                <div className="project-overlay"></div>
                
                {/* Floating Social Buttons */}
                <div className="floating-links">
                  <a href={project.github} target="_blank" rel="noreferrer" className="floating-btn" title="View Code">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </a>
                  <a href={project.demo} target="_blank" rel="noreferrer" className="floating-btn" title="Live Link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>
             </div>

             {/* Content */}
             <div className="project-content-v2">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <div className="star-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                </div>

                <p className="project-desc">{project.desc}</p>

                <div className="project-tech-stack">
                    {project.tech.slice(0, 4).map((t, i) => (
                        <span key={i} className="tech-badge-v2">{t}</span>
                    ))}
                    {project.tech.length > 4 && <span className="tech-badge-v2">+{project.tech.length - 4}</span>}
                </div>

                <a href={project.github} target="_blank" rel="noreferrer" className="view-code-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  View Code
                </a>
             </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
