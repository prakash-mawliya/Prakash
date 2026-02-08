const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "Pitch Winner",
      org: "Jnanagni Hackathon, Gurukula Kangri Vishwavidyalaya Haridwar",
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
      title: "Rank 25",
      org: "IIT Roorkee Young Coders Hackathon",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      )
    },
    {
      id: 3,
      title: "National Elite",
      org: "Naukri Campus Young Turks",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
    {
      id: 4,
      title: "Silver Medalist",
      org: "STATELEVELVOLLEYBALLCHAMPIONSHIP",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  const stats = [
    { id: 1, count: "150+", label: "DSA Problems" },
    { id: 2, count: "500+", label: "Git Commits" },
    { id: 3, count: "5+", label: "Hackathons" },
  ];

  return (
    <section id="achievements" className="achievements-section">
      <div className="achievements-wrapper">
        
        {/* Header */}
        <div className="achievements-header-container">
          <h2 className="heading">Achievements & <span>Awards</span></h2>
          <p className="achievements-subtitle">Recognition across competitions for technical excellence and innovation</p>
        </div>

        <div className="achievements-content-grid">
          
          {/* Left Column: Trophy Visual */}
          <div className="trophy-container">
            <div className="trophy-ring"></div>
            <div className="trophy-icon-large">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <div className="trophy-glow"></div>
          </div>

          {/* Right Column: List */}
          <div className="achievements-list">
            {achievements.map((item) => (
              <div key={item.id} className="achievement-card">
                <div className="achievement-icon-box">
                  {item.icon}
                </div>
                <div className="achievement-info">
                  <h3>{item.title}</h3>
                  <p>{item.org}</p>
                </div>
                <div className="achievement-dot"></div>
              </div>
            ))}
          </div>

        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <span className="stat-number">{stat.count}</span>
              <span className="stat-label-text">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Achievements;
