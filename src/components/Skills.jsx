import { useState } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'AI', 'DevOps'];

  const skillsData = [
    {
      id: 1,
      category: 'Backend',
      title: 'Languages & Core',
      level: 'Advanced',
      items: ['Java', 'C', 'C++', 'Python', 'SQL'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    },
    {
      id: 2,
      category: 'Frontend',
      title: 'Frontend Ecosystem',
      level: 'Advanced',
      items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      )
    },
    {
      id: 3,
      category: 'Backend',
      title: 'Backend & Database',
      level: 'Advanced',
      items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path>
        </svg>
      )
    },
    {
      id: 4,
      category: 'DevOps',
      title: 'DevOps & Tools',
      level: 'Intermediate',
      items: ['Git/GitHub', 'Vercel', 'Postman', 'Google Cloud'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19c0-1.7-1.3-3-3-3h-1.1c-.1-2.9-2.5-5.3-5.4-5.2-2.5.1-4.6 2-4.9 4.5H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h14.5c1.7 0 3-1.3 3-3z"></path>
          <path d="M20 17h2"></path>
          <path d="M22 15l-2 2 2 2"></path>
        </svg>
      )
    },
    {
      id: 5,
      category: 'AI',
      title: 'AI & Intelligence',
      level: 'Intermediate',
      items: ['Pandas', 'NumPy', 'Scikit-learn'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
          <path d="M12 12a2 2 0 1 0 2-2 2 2 0 0 0-2 2z"></path>
          <path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      )
    }
  ];

  const filteredSkills = activeTab === 'All' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeTab);

  return (
    <section id="skills" className="tech-section">
      <div className="tech-header-container">
        <motion.h2 
          className="heading"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Tech <span>Stack</span>
        </motion.h2>
        <motion.p 
          className="tech-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          A comprehensive toolkit spanning web development, AI, and data technologies
        </motion.p>
      </div>

      <div className="tech-tabs">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`tech-tab-btn ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tech-grid">
        {filteredSkills.map((skill) => (
          <div className="tech-card" key={skill.id}>
            <div className="tech-card-header">
              <div className="tech-icon-box">
                {skill.icon}
              </div>
              <span className={`tech-badge ${skill.level.toLowerCase()}`}>{skill.level}</span>
            </div>
            
            <h3>{skill.title}</h3>
            
            <ul className="tech-list">
              {skill.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
