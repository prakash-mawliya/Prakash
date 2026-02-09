
const ResumeSection = () => {
  // Placeholder data for resumes
  // User needs to place PDF files in public/resumes/ folder
  const resumes = [
    {
      id: 1,
      name: 'General Resume',
      description: 'Prakash Resume (Version 1)',
      fileName: 'Prakash_Resume_1.pdf' 
    },
    {
      id: 2,
      name: 'Data Analyst Resume',
      description: 'Prakash Resume (Version 2)',
      fileName: 'Prakash_Resume_2.pdf'
    },
    {
      id: 3,
      name: 'Full Stack Resume',
      description: 'Full Stack Web Developer Resume',
      fileName: 'Prakash_FullStack_Resume.pdf'
    }
  ];

  return (
    <section id="resumes" className="resume-section" style={styles.section}>
      <div className="section-container" style={styles.container}>
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="heading">My <span style={{ color: 'var(--primary-color)' }}>Resumes</span></h2>
          <p className="subtitle" style={{ color: 'var(--text-muted)' }}>
            Tailored CVs for different roles. View or download the one that fits your needs.
          </p>
        </div>

        <div className="resumes-grid" style={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card" style={styles.card}>
              <div className="icon-wrapper" style={styles.iconWrapper}>
                {/* PDF Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </div>
              
              <h3 style={styles.cardTitle}>{resume.name}</h3>
              <p style={styles.cardDesc}>{resume.description}</p>
              
              <div className="card-actions" style={styles.actions}>
                <a 
                  href={`/resumes/${resume.fileName}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.btnView}
                  className="btn-view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  View
                </a>
                <a 
                  href={`/resumes/${resume.fileName}`} 
                  download
                  style={styles.btnDownload}
                  className="btn-download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '4rem 9%',
    backgroundColor: 'var(--bg-secondary)', // Assuming variable exists, roughly light gray/dark gray
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'var(--bg-color)',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease',
    border: '1px solid var(--border)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '50%',
    display: 'inline-flex',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--text-color)',
  },
  cardDesc: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
  },
  btnView: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-color)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnDownload: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    background: 'var(--primary-color)',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  }
};

export default ResumeSection;
