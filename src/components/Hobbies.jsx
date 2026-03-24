import { motion } from 'framer-motion';

const Hobbies = () => {
  const hobbies = [
    {
      id: 1,
      title: "Singing",
      desc: "Music is my escape. Whether on stage or alone, singing allows me to connect with efficient emotions.",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop",
      icon: "🎤",
      link: "https://www.bandlab.com/prakash_mawliya"
    },
    {
      id: 2,
      title: "Volleyball",
      desc: "Teamwork and agility on the court. I love the thrill of a good spike and the camaraderie of the game.",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600",
      icon: "🏐"
    },
    {
      id: 3,
      title: "Cricket",
      desc: "A gentleman's game that teaches patience and strategy. I enjoy playing matches on weekends.",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600",
      icon: "🏏",
      link: "https://cricheroes.com/player-profile/18788966/prakash-e-mawliya/matches"
    },
    {
      id: 4,
      title: "Traveling",
      desc: "Exploring new places and cultures expands my horizons. Every journey tells a new story.",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
      icon: "✈️"
    },
    {
      id: 5,
      title: "Gym & Fitness",
      desc: "Discipline and strength. Hitting the gym keeps me physically fit and mentally sharp.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
      icon: "💪"
    }
  ];

  return (
    <section className="hobbies-section" id="hobbies">
      <div className="section-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="heading"
        >
          My <span>Interests</span>
        </motion.h2>
        <p className="subheading">Beyond code, here's what moves me.</p>
      </div>

      <div className="hobbies-grid">
        {hobbies.map((hobby, index) => (
          <motion.div 
            key={hobby.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="hobby-card-bg"
          >
            {/* Background Image Wrapper */}
            <div 
               style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '100%',
                   backgroundImage: `url(${hobby.image})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   zIndex: 0,
                   transition: 'transform 0.5s ease',
               }}
               className="hobby-bg-img"
            />
            
            {/* Content Overlay */}
            <div className="hobby-content" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{hobby.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{hobby.title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: hobby.link ? '1rem' : '0' }}>{hobby.desc}</p>
              
              {hobby.link ? (
                  <a 
                    href={hobby.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="check-work-btn"
                  >
                      Check My Work →
                  </a>
              ) : (
                <span 
                    className="check-work-btn"
                  style={{ opacity: 0.6, cursor: 'not-allowed', background: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                    Coming Soon...
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Hobbies;
