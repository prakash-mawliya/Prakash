import { motion } from 'framer-motion';
import { userData } from '../data';

const Projects = () => {
  // Stagger animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for each project card
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
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
            className="project-card" 
            key={project.id}
            variants={cardVariants}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
             <div 
                className="project-img" 
                style={{backgroundImage: `url(${project.imageUrl || 'https://via.placeholder.com/400'})`}}
             ></div>
             <div className="project-content">
                <h3>{project.title}</h3>
                <div className="project-tech">
                    {project.tech.map((t, i) => (
                        <span key={i}>{t}</span>
                    ))}
                </div>
                <p>{project.desc}</p>
                <div className="project-links">
                    <a href={project.github} target="_blank" rel="noreferrer" className="link-btn">View Code</a>
                    <a href={project.demo} target="_blank" rel="noreferrer" className="link-btn">Live Demo</a>
                </div>
             </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
