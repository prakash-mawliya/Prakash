
const About = () => {
  const stats = [
    {
      id: 1,
      label: "Hackathon Winner",
      value: "1x",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      )
    },
    {
      id: 2,
      label: "Major Projects",
      value: "5+",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
        </svg>
      )
    },
    {
      id: 3,
      label: "Happy Clients",
      value: "3+",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  const quickFacts = [
    {
      id: 1,
      text: "Location",
      value: "Palsana, Sikar, Rajasthan, IN",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      )
    },
    {
      id: 2,
      text: "Experience",
      value: "Fresher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
      )
    },
    {
      id: 3,
      text: "Status",
      value: "Available for Hire",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
      )
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-bg-orb orb-1"></div>
      <div className="about-bg-orb orb-2"></div>

      <div className="about-container">
        
        {/* Header */}
        <div className="about-header">
          <h2 className="section-title">
            About <span className="highlight-cyan">Me</span>
          </h2>
          <div className="title-underline"></div>
          
          <div className="about-bio">
            <p>
              Aspiring Software Development Engineer with a strong foundation in Data Structures, Algorithms, and Full Stack Development. I specialize in architecting scalable web solutions and integrating Agentic AI systems. With a focus on performance optimization and clean code, I bridge the gap between complex backend logic and intuitive user experiences.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-v2">
          {stats.map((stat, index) => (
            <div className={`stat-card-v2 ${index === 0 ? 'highlight-card' : ''}`} key={stat.id}>
               <div className="card-hover-line"></div>
               {index === 0 && <div className="card-corner-glow"></div>}

              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              
              <div className="stat-info-v2">
                <h3 className="stat-value-v2">{stat.value}</h3>
                <p className="stat-label-v2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Facts Section */}
        <div className="quick-facts-container">
          
          <div className="quick-facts-header">
             <h3>Quick <span className="highlight-cyan">Facts</span></h3>
          </div>
          
          <div className="quick-facts-list">
            {quickFacts.map((fact) => (
              <div className="fact-item" key={fact.id}>
                <div className="fact-icon-wrapper">
                  {fact.icon}
                </div>
                <div className="fact-text">
                  <span className="fact-label">{fact.text}</span>
                  <span className="fact-value">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
