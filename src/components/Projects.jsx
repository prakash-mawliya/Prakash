import { userData } from '../data';

const Projects = () => {
  return (
    <section className="portfolio" id="projects">
      <h2 className="heading">Featured <span>Projects</span></h2>

      <div className="project-grid">
        {userData.projects.map((project) => (
          <div className="project-card" key={project.id}>
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
