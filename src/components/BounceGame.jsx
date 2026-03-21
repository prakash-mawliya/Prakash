import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const MOVEMENT_SPEED = 5;
const FRICTION = 0.85;

const BounceGame = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [cameraX, setCameraX] = useState(0); // Camera scrolling
  
  // Level Dimensions
  const LEVEL_WIDTH = 2400;

  // --- Particle System ---
  const particlesRef = useRef([]);

  const addParticles = (x, y, color) => {
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        color
      });
    }
  };

  // --- Game Objects ---
  const levelRef = useRef({
      platforms: [
          // Starting Area
          { x: 0, y: 400, w: 600, h: 50, type: 'grass' },
          { x: 300, y: 320, w: 120, h: 20, type: 'brick' },
          { x: 500, y: 250, w: 120, h: 20, type: 'brick' },
          
          // Gap Crossing
          { x: 650, y: 400, w: 200, h: 50, type: 'grass' }, // Island
          { x: 900, y: 350, w: 100, h: 20, type: 'stone' }, // Floater 1
          { x: 1100, y: 300, w: 100, h: 20, type: 'stone' }, // Floater 2
          
          // The Tower
          { x: 1300, y: 400, w: 400, h: 50, type: 'grass' }, // Base
          { x: 1400, y: 320, w: 100, h: 20, type: 'brick' },
          { x: 1550, y: 240, w: 100, h: 20, type: 'brick' },
          { x: 1400, y: 160, w: 100, h: 20, type: 'brick' }, // Top of tower

          // Final Stretch
          { x: 1800, y: 400, w: 600, h: 50, type: 'grass' }, // Final ground
          { x: 2000, y: 320, w: 20, h: 80, type: 'wall' },   // Obstacle
      ],
      spikes: [
          { x: 200, y: 390, w: 60, h: 10 },
          { x: 1350, y: 390, w: 80, h: 10 },
          { x: 1900, y: 390, w: 80, h: 10 }
      ],
      rings: [
          { x: 360, y: 280, r: 12, collected: false },
          { x: 560, y: 210, r: 12, collected: false },
          { x: 950, y: 310, r: 12, collected: false },
          { x: 1150, y: 260, r: 12, collected: false },
          { x: 1450, y: 120, r: 12, collected: false }, // Tower top
          { x: 1600, y: 200, r: 12, collected: false },
          { x: 2010, y: 280, r: 12, collected: false }, // Over wall
      ],
      exit: { x: 2200, y: 300, w: 60, h: 100 }
  });

  const ballRef = useRef({
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 14,
    isGrounded: false
  });

  const controlsRef = useRef({ left: false, right: false, jump: false });

  const resetGame = () => {
    ballRef.current = { x: 100, y: 300, vx: 0, vy: 0, radius: 14, isGrounded: false };
    levelRef.current.rings.forEach(r => r.collected = false);
    setScore(0);
    setCameraX(0); // Reset camera
    particlesRef.current = [];
    setGameState('playing');
  };

  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      
      switch(e.key) {
        case 'ArrowLeft': controlsRef.current.left = true; break;
        case 'ArrowRight': controlsRef.current.right = true; break;
        case 'ArrowUp': 
        case ' ': 
          if (ballRef.current.isGrounded) {
             ballRef.current.vy = JUMP_FORCE;
             ballRef.current.isGrounded = false;
             addParticles(ballRef.current.x, ballRef.current.y + ballRef.current.radius, '#FFF');
          }
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      switch(e.key) {
        case 'ArrowLeft': controlsRef.current.left = false; break;
        case 'ArrowRight': controlsRef.current.right = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // --- Game Loop ---
  useEffect(() => {
    // Only run loop if Playing
    if (gameState !== 'playing') return;

    let animId;
    let time = 0;

    const gameLoop = () => {
      time += 0.05;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const ball = ballRef.current;
      const level = levelRef.current;

      // 1. Update Physics
      if (controlsRef.current.left) ball.vx = -MOVEMENT_SPEED;
      else if (controlsRef.current.right) ball.vx = MOVEMENT_SPEED;
      else ball.vx *= FRICTION;

      ball.vy += GRAVITY;
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // World Bounds
      if (ball.x < ball.radius) ball.x = ball.radius;
      if (ball.x > LEVEL_WIDTH - ball.radius) ball.x = LEVEL_WIDTH - ball.radius;

      // 2. Collision Resolution
      ball.isGrounded = false;
      level.platforms.forEach(plat => {
          // Broad check
          if (ball.x + ball.radius > plat.x && ball.x - ball.radius < plat.x + plat.w &&
              ball.y + ball.radius > plat.y && ball.y - ball.radius < plat.y + plat.h) {
              
              // Resolve
              const overlapTop = (ball.y + ball.radius) - plat.y;
              const overlapBottom = (plat.y + plat.h) - (ball.y - ball.radius);
              const overlapLeft = (ball.x + ball.radius) - plat.x;
              const overlapRight = (plat.x + plat.w) - (ball.x - ball.radius);
              
              const min = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

              if (min === overlapTop && ball.vy > 0) { // Landed
                  ball.y = plat.y - ball.radius;
                  ball.vy = -ball.vy * 0.4; // Bounce
                  if(Math.abs(ball.vy) < 2) ball.vy = 0;
                  ball.isGrounded = true;
              } else if (min === overlapBottom && ball.vy < 0) { // Hit Head
                  ball.y = plat.y + plat.h + ball.radius;
                  ball.vy = 0;
              } else if (min === overlapLeft) { // Hit Wall Left
                  ball.x = plat.x - ball.radius;
                  ball.vx = 0;
              } else if (min === overlapRight) { // Hit Wall Right
                  ball.x = plat.x + plat.w + ball.radius;
                  ball.vx = 0;
              }
          }
      });

      // 3. Spikes Check
      level.spikes.forEach(s => {
          if (ball.x > s.x && ball.x < s.x + s.w &&
              ball.y + ball.radius > s.y + 4) { // Only tip kills
               setGameState('lost');
               addParticles(ball.x, ball.y, '#FF0000');
          }
      });

      // 4. Rings Check
      level.rings.forEach(r => {
          if (!r.collected) {
              const dx = ball.x - r.x;
              const dy = ball.y - r.y;
              if (Math.sqrt(dx*dx+dy*dy) < ball.radius + r.r) {
                  r.collected = true;
                  setScore(prev => prev + 1);
                  addParticles(r.x, r.y, '#FFD700');
                  // Optional: Sound effect
              }
          }
      });

      // 5. Exit Check
      if (ball.x > level.exit.x && ball.x < level.exit.x + level.exit.w &&
          ball.y > level.exit.y && ball.y < level.exit.y + level.exit.h) {
          setGameState('won');
      }

      // 6. Fall Death
      if (ball.y > CANVAS_HEIGHT + 100) setGameState('lost');

      // 7. Update Particles
      particlesRef.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);


      // --- RENDER ---
      
      // Calculate Camera Target (Focus on ball, clamped to world)
      let targetX = ball.x - CANVAS_WIDTH / 2;
      if (targetX < 0) targetX = 0;
      if (targetX > LEVEL_WIDTH - CANVAS_WIDTH) targetX = LEVEL_WIDTH - CANVAS_WIDTH;
      // Smooth Camera
      const newCamX = cameraX + (targetX - cameraX) * 0.1;
      setCameraX(newCamX); // React state update trigger re-render anyway? 
      // Actually, updating state inside loop isn't ideal for fps. 
      // But for React + Canvas simple game, it syncs the view.
      
      // Clear Screen
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Logical size

      // Sky Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#87CEEB'); // Sky Blue
      grad.addColorStop(1, '#B0E0E6'); // Powder Blue
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.save();
      ctx.translate(-newCamX, 0); // Apply Camera

      // Draw Platforms
      level.platforms.forEach(p => {
         // Base Color
         ctx.fillStyle = p.type === 'grass' ? '#5D4037' : '#795548';
         ctx.fillRect(p.x, p.y, p.w, p.h);
         
         // Detail
         if(p.type === 'grass') {
             ctx.fillStyle = '#4CAF50';
             ctx.fillRect(p.x, p.y, p.w, 8); // Grass top
         } else if (p.type === 'brick') {
             ctx.strokeStyle = '#3E2723';
             ctx.strokeRect(p.x, p.y, p.w, p.h);
             // Brick pattern lines could go here
         }
      });

      // Draw Spikes
      ctx.fillStyle = '#424242';
      level.spikes.forEach(s => {
          ctx.beginPath();
          const spikeCount = Math.floor(s.w / 10);
          for(let i=0; i<spikeCount; i++) {
              const lx = s.x + i*10;
              ctx.moveTo(lx, s.y + s.h);
              ctx.lineTo(lx + 5, s.y);
              ctx.lineTo(lx + 10, s.y + s.h);
          }
          ctx.fill();
      });

      // Draw Rings
      level.rings.forEach(r => {
          if(!r.collected) {
              const yOffset = Math.sin(time + r.x * 0.1) * 5;
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#FFD700';
              ctx.beginPath();
              ctx.arc(r.x, r.y + yOffset, r.r, 0, Math.PI*2);
              ctx.stroke();
          }
      });

      // Draw Exit
      ctx.fillStyle = '#1B5E20';
      ctx.fillRect(level.exit.x, level.exit.y, level.exit.w, level.exit.h);
      ctx.fillStyle = '#FFF';
      ctx.fillText('GOAL', level.exit.x + 10, level.exit.y + 40);

      // Draw Particles
      particlesRef.current.forEach(p => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
          ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw Ball
      // Shadow
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.scale(1, 0.3);
      ctx.beginPath();
      ctx.arc(0, ball.radius * 3, ball.radius, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
      ctx.restore();

      // Body
      const ballGrad = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, ball.radius);
      ballGrad.addColorStop(0, '#FF5252');
      ballGrad.addColorStop(1, '#B71C1C');
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
      ctx.fill();
      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(ball.x - 4, ball.y - 4, 4, 0, Math.PI*2);
      ctx.fill();

      ctx.restore(); // Undo Camera

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, cameraX]); // Dependencies

  // Render UI
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="calculator-modal bounce-theme"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
                maxWidth: '850px', 
                background: '#263238', 
                padding: '20px', 
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
             <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                 <canvas 
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="game-canvas"
                    style={{ background: '#87CEEB', display: 'block', width: '100%' }}
                 />

                 {/* HUD */}
                 <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '15px' }}>
                     <div style={{ background: 'rgba(0,0,0,0.6)', color: '#FFD700', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                         RINGS: {score}
                     </div>
                 </div>

                 {/* Close Btn */}
                 <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: '#FFF', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer' }}
                 >
                     ✕
                 </button>

                 {/* Menus */}
                 {gameState === 'menu' && (
                     <div className="game-overlay">
                         <h1 className="bounce-title">BOUNCE <span style={{color:'#FF5252'}}>PRO</span></h1>
                         <p style={{marginBottom: '20px', fontSize: '1.1rem'}}>Use Arrows to Move • Space to Jump</p>
                         <button className="bounce-btn" onClick={resetGame}>START ADVENTURE</button>
                     </div>
                 )}

                 {gameState === 'lost' && (
                     <div className="game-overlay" style={{background: 'rgba(50,0,0,0.8)'}}>
                         <h1 style={{color: '#FF5252', fontSize: '3rem'}}>GAME OVER</h1>
                         <p>Don't give up!</p>
                         <button className="bounce-btn" onClick={resetGame}>TRY AGAIN</button>
                     </div>
                 )}

                 {gameState === 'won' && (
                     <div className="game-overlay" style={{background: 'rgba(0,50,0,0.8)'}}>
                         <h1 style={{color: '#69F0AE', fontSize: '3rem'}}>LEVEL COMPLETED!</h1>
                         <p>All Rings Collected: {score}</p>
                         <button className="bounce-btn" onClick={resetGame}>REPLAY</button>
                     </div>
                 )}
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BounceGame;
