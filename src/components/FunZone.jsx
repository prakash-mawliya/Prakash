import { motion } from 'framer-motion';
import { useState } from 'react';
import BounceGame from './BounceGame';
import CricketGame from './CricketGame';
import EMICalculator from './EMICalculator';
import ImageConverter from './ImageConverter';
import QRCodeGenerator from './QRCodeGenerator';
import RetroPlatformerGame from './RetroPlatformerGame';
import SIPCalculator from './SIPCalculator';
import SnakeGame from './SnakeGame';

const FunZone = () => {
  const [activeTool, setActiveTool] = useState(null);

  const openTool = (toolKey) => {
    setActiveTool(toolKey);
  };

  const tools = [
    {
      id: 1,
      title: "Image Converter",
      icon: "🖼️",
      desc: "Convert WebP to JPG, JPG to WebP, and more instantly.",
      action: () => openTool('image')
    },
    {
      id: 2,
      title: "EMI Converter",
      icon: "💰",
      desc: "Calculate Equated Monthly Installments quickly and accurately.",
      action: () => openTool('emi')
    },
    {
      id: 3,
      title: "SIP Calculator",
      icon: "📈",
      desc: "Project returns on your Systematic Investment Plans with precision.",
      action: () => openTool('sip')
    },
    {
      id: 4,
      title: "Quantum QR Forge",
      icon: "🧬",
      desc: "Generate futuristic QR codes with custom colors and high-tech styling.",
      action: () => openTool('qr')
    },
    {
      id: 5,
      title: "Snake AI Game",
      icon: "🐍",
      desc: "Watch an AI solve the classic snake game using BFS.",
      action: () => openTool('snake')
    },
    {
      id: 6,
      title: "Bounce Classic",
      icon: "🔴",
      desc: "Play the nostalgic Nokia Bounce ball game.",
      action: () => openTool('bounce')
    },
    {
      id: 7,
      title: "Nokia Cricket Remastered",
      icon: "🏏",
      desc: "Play Classic Nokia or Modern Pro modes with dynamic physics!",
      action: () => openTool('cricket')
    },
    {
      id: 8,
      title: "Retro Platformer X",
      icon: "🕹️",
      desc: "Run, jump, collect coins, dodge enemies in Classic & Modern modes.",
      action: () => openTool('platformer')
    }
  ];

  return (
    <section className="tools-section" id="funzone">
      <div className="section-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="heading"
        >
          Fun <span>Zone</span>
        </motion.h2>
        <p className="subheading" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Fun games and utilities built for you to enjoy.</p>
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
            onClick={tool.action ? tool.action : undefined}
            onKeyDown={tool.action ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                tool.action();
              }
            } : undefined}
            role={tool.action ? 'button' : undefined}
            tabIndex={tool.action ? 0 : undefined}
            style={{ cursor: tool.action ? 'pointer' : 'default' }}
          >
            <div className="tool-icon-wrapper" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span className="tool-icon">{tool.icon}</span>
            </div>
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-desc">{tool.desc}</p>
            
            {tool.action ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  tool.action();
                }}
                className="tool-btn"
                style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem 0' }}
                type="button"
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

      <CricketGame
        isOpen={activeTool === 'cricket'}
        onClose={() => setActiveTool(null)}
      />

      <RetroPlatformerGame
        isOpen={activeTool === 'platformer'}
        onClose={() => setActiveTool(null)}
      />
    </section>
  );
};

export default FunZone;
