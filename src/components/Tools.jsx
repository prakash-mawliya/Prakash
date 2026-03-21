import { motion } from 'framer-motion';
import { useState } from 'react';
import BounceGame from './BounceGame';
import EMICalculator from './EMICalculator';
import ImageConverter from './ImageConverter';
import QRCodeGenerator from './QRCodeGenerator';
import SIPCalculator from './SIPCalculator';
import SnakeGame from './SnakeGame';

const Tools = () => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 1,
      title: "Image Converter",
      icon: "🖼️",
      desc: "Convert WebP to JPG, JPG to WebP, and more instantly.",
      action: () => setActiveTool('image')
    },
    {
      id: 2,
      title: "EMI Converter",
      icon: "💰",
      desc: "Calculate Equated Monthly Installments quickly and accurately.",
      action: () => setActiveTool('emi')
    },
    {
      id: 3,
      title: "SIP Calculator",
      icon: "📈",
      desc: "Project returns on your Systematic Investment Plans with precision.",
      action: () => setActiveTool('sip')
    },
    {
      id: 4,
      title: "QR Code Generator",
      icon: "🔗",
      desc: "Generate custom QR codes for links, text, and more.",
      action: () => setActiveTool('qr')
    },
    {
      id: 5,
      title: "Snake AI Game",
      icon: "🐍",
      desc: "Watch an AI solve the classic snake game using BFS.",
      action: () => setActiveTool('snake')
    },
    {
      id: 6,
      title: "Bounce Classic",
      icon: "🔴",
      desc: "Play the nostalgic Nokia Bounce ball game.",
      action: () => setActiveTool('bounce')
    }
  ];

  return (
    <section className="tools-section" id="tools">
      <div className="section-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="heading"
        >
          Creative <span>Tools</span>
        </motion.h2>
        <p className="subheading" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Utility apps built to simplify your workflow.</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <motion.div 
            className="tool-card"
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
          >
            <div className="tool-icon-wrapper" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span className="tool-icon">{tool.icon}</span>
            </div>
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-desc">{tool.desc}</p>
            
            {tool.action ? (
              <button 
                onClick={tool.action} 
                className="tool-btn"
                style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem 0' }}
              >
                Try Now &rarr;
              </button>
            ) : (
              <a 
                href={tool.link} 
                className="tool-btn disabled" 
                onClick={(e) => {
                   if(tool.link === '#') {
                       e.preventDefault();
                       alert(tool.msg || "This tool is under development!");
                   }
                }}
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Coming Soon
              </a>
            )}
          </motion.div>
        ))}
      </div>

      <SIPCalculator 
        isOpen={activeTool === 'sip'} 
        onClose={() => setActiveTool(null)} 
      />
      
      <EMICalculator 
        isOpen={activeTool === 'emi'} 
        onClose={() => setActiveTool(null)} 
      />

      <ImageConverter
        isOpen={activeTool === 'image'}
        onClose={() => setActiveTool(null)}
      />

      <QRCodeGenerator
        isOpen={activeTool === 'qr'}
        onClose={() => setActiveTool(null)}
      />

      <SnakeGame
        isOpen={activeTool === 'snake'}
        onClose={() => setActiveTool(null)}
      />

      <BounceGame
        isOpen={activeTool === 'bounce'}
        onClose={() => setActiveTool(null)}
      />
    </section>
  );
};

export default Tools;
