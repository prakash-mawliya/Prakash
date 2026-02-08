import { useState } from 'react';

const Journey = () => {
  const [activeTab, setActiveTab] = useState('experience');

  const experienceData = [
    {
      id: 1,
      role: 'Software Engineer Intern (Web Applications)',
      org: 'SuperWebs 360',
      date: '2 Months',
      badge: 'Internship',
      desc: [
        'Contributed to application development and testing of web-based business modules using PHP and MySQL',
        'Analyzed client requirements and translated them into clear technical tasks',
        'Participated in debugging, defect fixing, and quality assurance activities',
        'Developed and supported a CRM system to improve operational efficiency',
        'Collaborated with cross-functional teams to enhance UI/UX and system stability',
        'Documented features and fixes to support long-term maintainability'
      ]
    }
  ];

  const educationData = [
    {
      id: 1,
      role: 'Bachelor of Technology (CSE)',
      org: 'Gurukula Kangri Vishwavidyalaya, Haridwar',
      date: '2022 – 2026',
      badge: 'CGPA: 7.8',
      desc: 'Specialized in Data Structures, Algorithms, and Web Technologies. Lead Developer at Programming Club.'
    },
    {
      id: 2,
      role: 'Higher Secondary (RBSE)',
      org: 'Matrix High School, Sikar',
      date: '2020',
      badge: 'Science Math',
      desc: 'Completed with a focus on Physics, Chemistry, and Mathematics.'
    },
    {
      id: 3,
      role: 'Secondary Education (RBSE)',
      org: 'Indian Public School, Abhaipura Nangle,Sikar',
      date: '2018'
    }
  ];

  const data = activeTab === 'experience' ? experienceData : educationData;

  return (
    <section id="journey" className="journey-section">
      <div className="journey-container">
        
        {/* Header */}
        <div className="journey-header">
          <h2 className="heading">My <span>Journey</span></h2>
          <p className="journey-subtitle">From learning foundations to building real-world solutions</p>
        </div>

        {/* Tab Toggle */}
        <div className="journey-tabs">
          <button 
            className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button 
            className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
        </div>

        {/* Timeline */}
        <div className="timeline-container">
          {data.map((item) => (
            <div className="timeline-item" key={item.id}>
              {/* Marker on the line */}
              <div className="timeline-marker"></div>

              {/* Card Content */}
              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="role-title">{item.role}</h3>
                    <div className="org-name">
                      {/* Location/Org Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {item.org}
                    </div>
                  </div>

                  <div className="timeline-badges">
                    {item.badge && (
                      <span className="badge-featured">{item.badge}</span>
                    )}
                    <span className="date-badge">{item.date}</span>
                  </div>
                </div>
                
                <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {Array.isArray(item.desc) ? (
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, listStyleType: 'disc' }}>
                      {item.desc.map((point, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.desc}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Journey;
