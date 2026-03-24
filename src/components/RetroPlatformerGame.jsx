import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const WORLD_WIDTH = 3600;
const PLAYER_SIZE = 28;
const BASE_GRAVITY = 0.55;
const JUMP_VELOCITY = -12.5;
const MOVE_SPEED = 4.6;

const buildPlatforms = () => [
  { x: 0, y: 440, w: 540, h: 60 },
  { x: 580, y: 395, w: 220, h: 20 },
  { x: 860, y: 340, w: 170, h: 20 },
  { x: 1080, y: 285, w: 170, h: 20 },
  { x: 1340, y: 380, w: 280, h: 20 },
  { x: 1680, y: 320, w: 170, h: 20 },
  { x: 1930, y: 260, w: 150, h: 20 },
  { x: 2160, y: 360, w: 240, h: 20 },
  { x: 2470, y: 430, w: 270, h: 20 },
  { x: 2810, y: 370, w: 220, h: 20 },
  { x: 3110, y: 305, w: 190, h: 20 },
  { x: 3360, y: 440, w: 260, h: 60 },
];

const buildCoins = () => [
  { x: 180, y: 390, collected: false },
  { x: 635, y: 350, collected: false },
  { x: 920, y: 295, collected: false },
  { x: 1140, y: 240, collected: false },
  { x: 1450, y: 330, collected: false },
  { x: 1730, y: 270, collected: false },
  { x: 1980, y: 210, collected: false },
  { x: 2250, y: 310, collected: false },
  { x: 2590, y: 380, collected: false },
  { x: 2890, y: 320, collected: false },
  { x: 3170, y: 255, collected: false },
  { x: 3430, y: 395, collected: false },
];

const buildEnemies = () => [
  { x: 740, y: 367, w: 30, h: 28, dir: 1, minX: 590, maxX: 770, speed: 1.2 },
  { x: 1540, y: 352, w: 30, h: 28, dir: -1, minX: 1360, maxX: 1575, speed: 1.35 },
  { x: 2350, y: 332, w: 30, h: 28, dir: 1, minX: 2180, maxX: 2370, speed: 1.45 },
  { x: 2990, y: 342, w: 30, h: 28, dir: -1, minX: 2830, maxX: 3000, speed: 1.5 },
];

const buildObstacles = () => [
  { x: 1220, y: 430, w: 38, h: 10 },
  { x: 2060, y: 430, w: 42, h: 10 },
  { x: 2720, y: 420, w: 36, h: 10 },
  { x: 3260, y: 430, w: 44, h: 10 },
];

const RetroPlatformerGame = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const openedAtRef = useRef(0);
  const keysRef = useRef({ left: false, right: false, jump: false });

  const [mode, setMode] = useState('classic');
  const [status, setStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);

  const gameRef = useRef({
    cameraX: 0,
    time: 0,
    difficultyScale: 1,
    player: {
      x: 80,
      y: 370,
      vx: 0,
      vy: 0,
      grounded: false,
      invulnerableUntil: 0,
    },
    platforms: buildPlatforms(),
    coins: buildCoins(),
    enemies: buildEnemies(),
    obstacles: buildObstacles(),
  });

  const theme = useMemo(() => {
    if (mode === 'classic') {
      return {
        skyTop: '#f2f2f2',
        skyBottom: '#c8c8c8',
        mountain: '#9a9a9a',
        platformTop: '#222222',
        platformSide: '#3c3c3c',
        player: '#111111',
        enemy: '#2b2b2b',
        coin: '#ffffff',
        obstacle: '#1d1d1d',
        hud: '#0f0f0f',
      };
    }
    return {
      skyTop: '#5fa8ff',
      skyBottom: '#d4efff',
      mountain: '#7db4ff',
      platformTop: '#14532d',
      platformSide: '#166534',
      player: '#4f46e5',
      enemy: '#ef4444',
      coin: '#f59e0b',
      obstacle: '#dc2626',
      hud: '#0f172a',
    };
  }, [mode]);

  const tone = (frequency, duration, type = 'square') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Silent fallback when audio is blocked by browser policies
    }
  };

  const resetAll = () => {
    gameRef.current = {
      cameraX: 0,
      time: 0,
      difficultyScale: 1,
      player: {
        x: 80,
        y: 370,
        vx: 0,
        vy: 0,
        grounded: false,
        invulnerableUntil: 0,
      },
      platforms: buildPlatforms(),
      coins: buildCoins(),
      enemies: buildEnemies(),
      obstacles: buildObstacles(),
    };
    setScore(0);
    setCoins(0);
    setLives(3);
    setStatus('playing');
  };

  const loseLifeAndRespawn = (nowTime) => {
    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        setStatus('gameover');
        tone(120, 0.5, 'sawtooth');
      }
      return Math.max(0, nextLives);
    });

    const game = gameRef.current;
    game.player.x = 80;
    game.player.y = 370;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.grounded = false;
    game.player.invulnerableUntil = nowTime + 1800;
  };

  useEffect(() => {
    if (!isOpen) return;
    openedAtRef.current = Date.now();
    const timeoutId = setTimeout(() => {
      resetAll();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd', ' ', 'arrowup', 'w'].includes(key)) {
        event.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = true;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = true;
      if (key === ' ' || key === 'arrowup' || key === 'w') keysRef.current.jump = true;
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = false;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = false;
      if (key === ' ' || key === 'arrowup' || key === 'w') keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || status !== 'playing') {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      const game = gameRef.current;
      const nowTime = performance.now();

      game.time += 1;
      game.difficultyScale = 1 + Math.min(game.time / 9000, 1.3);

      const player = game.player;
      const currentMoveSpeed = MOVE_SPEED * Math.min(game.difficultyScale, 1.45);

      if (keysRef.current.left) player.vx = -currentMoveSpeed;
      else if (keysRef.current.right) player.vx = currentMoveSpeed;
      else player.vx *= 0.8;

      if (keysRef.current.jump && player.grounded) {
        player.vy = JUMP_VELOCITY;
        player.grounded = false;
        tone(mode === 'classic' ? 250 : 320, 0.11, mode === 'classic' ? 'square' : 'triangle');
      }

      player.vy += BASE_GRAVITY;
      player.x += player.vx;
      player.y += player.vy;

      player.x = Math.max(0, Math.min(WORLD_WIDTH - PLAYER_SIZE, player.x));

      player.grounded = false;
      for (const platform of game.platforms) {
        const overlapX = player.x + PLAYER_SIZE > platform.x && player.x < platform.x + platform.w;
        const overlapY = player.y + PLAYER_SIZE > platform.y && player.y < platform.y + platform.h;
        if (!overlapX || !overlapY) continue;

        const fromTop = player.y + PLAYER_SIZE - player.vy <= platform.y + 2;
        if (fromTop) {
          player.y = platform.y - PLAYER_SIZE;
          player.vy = 0;
          player.grounded = true;
        } else if (player.y - player.vy >= platform.y + platform.h - 2) {
          player.y = platform.y + platform.h;
          player.vy = 0;
        } else if (player.x + PLAYER_SIZE / 2 < platform.x + platform.w / 2) {
          player.x = platform.x - PLAYER_SIZE;
          player.vx = 0;
        } else {
          player.x = platform.x + platform.w;
          player.vx = 0;
        }
      }

      if (player.y > CANVAS_HEIGHT + 80) {
        loseLifeAndRespawn(nowTime);
      }

      for (const enemy of game.enemies) {
        const enemySpeed = enemy.speed * game.difficultyScale;
        enemy.x += enemy.dir * enemySpeed;
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) enemy.dir *= -1;

        const hitEnemy =
          player.x < enemy.x + enemy.w &&
          player.x + PLAYER_SIZE > enemy.x &&
          player.y < enemy.y + enemy.h &&
          player.y + PLAYER_SIZE > enemy.y;

        if (hitEnemy && nowTime > player.invulnerableUntil) {
          loseLifeAndRespawn(nowTime);
          break;
        }
      }

      for (const obstacle of game.obstacles) {
        const hitObstacle =
          player.x < obstacle.x + obstacle.w &&
          player.x + PLAYER_SIZE > obstacle.x &&
          player.y + PLAYER_SIZE > obstacle.y &&
          player.y < obstacle.y + obstacle.h + 6;

        if (hitObstacle && nowTime > player.invulnerableUntil) {
          loseLifeAndRespawn(nowTime);
          break;
        }
      }

      for (const coin of game.coins) {
        if (coin.collected) continue;
        const dx = player.x + PLAYER_SIZE / 2 - coin.x;
        const dy = player.y + PLAYER_SIZE / 2 - coin.y;
        if (Math.hypot(dx, dy) < 24) {
          coin.collected = true;
          setCoins((prev) => prev + 1);
          setScore((prev) => prev + 10);
          tone(mode === 'classic' ? 520 : 660, 0.08, 'triangle');
        }
      }

      const allCollected = game.coins.every((coin) => coin.collected);
      if (allCollected) {
        game.coins = buildCoins();
        setScore((prev) => prev + 100);
      }

      const targetCamera = Math.min(
        Math.max(player.x - CANVAS_WIDTH * 0.35, 0),
        WORLD_WIDTH - CANVAS_WIDTH,
      );
      game.cameraX += (targetCamera - game.cameraX) * 0.09;

      context.imageSmoothingEnabled = mode !== 'classic';

      const skyGradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      skyGradient.addColorStop(0, theme.skyTop);
      skyGradient.addColorStop(1, theme.skyBottom);
      context.fillStyle = skyGradient;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (let i = 0; i < 8; i += 1) {
        const x = (i * 380 - (game.cameraX * (mode === 'classic' ? 0.15 : 0.22))) % (WORLD_WIDTH + 380);
        context.fillStyle = theme.mountain;
        context.globalAlpha = mode === 'classic' ? 0.25 : 0.22;
        context.beginPath();
        context.moveTo(x, 500);
        context.lineTo(x + 130, 290);
        context.lineTo(x + 260, 500);
        context.closePath();
        context.fill();
      }
      context.globalAlpha = 1;

      context.save();
      context.translate(-game.cameraX, 0);

      for (const platform of game.platforms) {
        context.fillStyle = theme.platformTop;
        context.fillRect(platform.x, platform.y, platform.w, 6);
        context.fillStyle = theme.platformSide;
        context.fillRect(platform.x, platform.y + 6, platform.w, platform.h - 6);
      }

      for (const obstacle of game.obstacles) {
        context.fillStyle = theme.obstacle;
        context.beginPath();
        context.moveTo(obstacle.x, obstacle.y + obstacle.h);
        context.lineTo(obstacle.x + obstacle.w / 2, obstacle.y);
        context.lineTo(obstacle.x + obstacle.w, obstacle.y + obstacle.h);
        context.closePath();
        context.fill();
      }

      for (const coin of game.coins) {
        if (coin.collected) continue;
        const pulse = 1 + Math.sin((game.time + coin.x) * 0.06) * 0.1;
        context.beginPath();
        context.fillStyle = theme.coin;
        context.arc(coin.x, coin.y, 10 * pulse, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = mode === 'classic' ? '#0a0a0a' : '#78350f';
        context.fillRect(coin.x - 2, coin.y - 7, 4, 14);
      }

      for (const enemy of game.enemies) {
        context.fillStyle = theme.enemy;
        context.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        context.fillStyle = mode === 'classic' ? '#d4d4d4' : '#fef2f2';
        context.fillRect(enemy.x + 6, enemy.y + 8, 6, 6);
        context.fillRect(enemy.x + 18, enemy.y + 8, 6, 6);
      }

      context.globalAlpha = nowTime < player.invulnerableUntil ? 0.4 + Math.abs(Math.sin(game.time * 0.2)) * 0.6 : 1;
      context.fillStyle = theme.player;
      context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
      context.fillStyle = mode === 'classic' ? '#eaeaea' : '#c7d2fe';
      context.fillRect(player.x + 6, player.y + 6, 6, 6);
      context.fillRect(player.x + 16, player.y + 6, 6, 6);
      context.fillStyle = mode === 'classic' ? '#1f1f1f' : '#1e1b4b';
      context.fillRect(player.x + 9, player.y + 18, 10, 3);
      context.globalAlpha = 1;

      context.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen, status, mode, theme]);

  const handleOverlayClose = () => {
    if (Date.now() - openedAtRef.current < 500) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClose}
        >
          <motion.div
            className="calculator-modal"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            onClick={(event) => event.stopPropagation()}
            style={{ maxWidth: '980px', background: '#020617', border: '1px solid #1e293b' }}
          >
            <div className="modal-header" style={{ background: 'transparent', borderBottom: '1px solid #1e293b' }}>
              <h3 style={{ color: '#e2e8f0' }}>Retro Platformer X</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ padding: '1rem 1.2rem 1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', color: '#e2e8f0' }}>
                  <span style={{ background: '#111827', padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>Score: {score}</span>
                  <span style={{ background: '#111827', padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>Coins: {coins}</span>
                  <span style={{ background: '#111827', padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>Lives: {lives}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => setMode('classic')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: mode === 'classic' ? '1px solid #fafafa' : '1px solid #334155',
                      background: mode === 'classic' ? '#1f2937' : '#0f172a',
                      color: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    Classic Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('modern')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: mode === 'modern' ? '1px solid #38bdf8' : '1px solid #334155',
                      background: mode === 'modern' ? '#0b3a63' : '#0f172a',
                      color: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    Modern Mode
                  </button>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'auto', borderRadius: '0.75rem', border: '1px solid #334155', background: '#000' }}>
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  style={{ width: '100%', maxHeight: '72vh', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '0.85rem', color: '#94a3b8', fontSize: '0.92rem' }}>
                <span>Controls: ← → / A D to move, Space / ↑ / W to jump</span>
                <span>Difficulty rises over time • Enemies use patrol AI</span>
              </div>

              {status === 'gameover' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: 'absolute',
                    inset: '6rem 1.2rem 1.2rem',
                    background: 'rgba(2, 6, 23, 0.78)',
                    borderRadius: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#f8fafc' }}>
                    <h2 style={{ marginBottom: '0.4rem' }}>Game Over</h2>
                    <p style={{ marginBottom: '0.9rem' }}>Final Score: {score} | Coins: {coins}</p>
                    <button
                      type="button"
                      onClick={resetAll}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '0.55rem',
                        border: 'none',
                        background: '#22c55e',
                        color: '#052e16',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Restart Game
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RetroPlatformerGame;
