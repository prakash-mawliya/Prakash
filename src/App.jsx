import About from './components/About';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import ResumeSection from './components/ResumeSection';
import Skills from './components/Skills';

function App() {
  // Application Main Component
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Achievements />
      <ResumeSection />
      <Contact />
      
      <footer style={{
        padding: '2rem 9%', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg-color)',
        color: 'var(--text-muted)'
      }}>
        <p>Copyright &copy; 2026 by Prakash | Built with React</p>
      </footer>
    </div>
  );
}

export default App;
