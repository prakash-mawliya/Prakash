import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const WORLD_WIDTH = 5200;
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
  { x: 3660, y: 390, w: 240, h: 20 },
  { x: 3970, y: 330, w: 220, h: 20 },
  { x: 4260, y: 280, w: 200, h: 20 },
  { x: 4520, y: 350, w: 250, h: 20 },
  { x: 4830, y: 420, w: 190, h: 20 },
  { x: 5020, y: 440, w: 200, h: 60 },
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
  { x: 3740, y: 340, collected: false },
  { x: 4060, y: 280, collected: false },
  { x: 4340, y: 230, collected: false },
  { x: 4640, y: 300, collected: false },
  { x: 4920, y: 370, collected: false },
];

const buildEnemies = () => [
  { x: 740, y: 367, w: 30, h: 28, dir: 1, minX: 590, maxX: 770, speed: 1.2 },
  { x: 1540, y: 352, w: 30, h: 28, dir: -1, minX: 1360, maxX: 1575, speed: 1.35 },
  { x: 2350, y: 332, w: 30, h: 28, dir: 1, minX: 2180, maxX: 2370, speed: 1.45 },
  { x: 2990, y: 342, w: 30, h: 28, dir: -1, minX: 2830, maxX: 3000, speed: 1.5 },
  { x: 3860, y: 362, w: 30, h: 28, dir: 1, minX: 3690, maxX: 3870, speed: 1.58 },
  { x: 4580, y: 322, w: 30, h: 28, dir: -1, minX: 4540, maxX: 4730, speed: 1.65 },
];

const buildObstacles = () => [
  { x: 1220, y: 430, w: 38, h: 10 },
  { x: 2060, y: 430, w: 42, h: 10 },
  { x: 2720, y: 420, w: 36, h: 10 },
  { x: 3260, y: 430, w: 44, h: 10 },
  { x: 4180, y: 430, w: 42, h: 10 },
  { x: 4860, y: 420, w: 42, h: 10 },
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
  const [level, setLevel] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const modeMenuRef = useRef(null);
  const levelMenuRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setViewportWidth(width);
        setViewportHeight(height);
        setIsMobile(width <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!showModeMenu && !showLevelMenu) return undefined;

    const closeOnOutsideClick = (event) => {
      const clickedInsideModeMenu = modeMenuRef.current?.contains(event.target);
      const clickedInsideLevelMenu = levelMenuRef.current?.contains(event.target);

      if (!clickedInsideModeMenu && !clickedInsideLevelMenu) {
        setShowModeMenu(false);
        setShowLevelMenu(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [showLevelMenu, showModeMenu]);

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
    setShowModeMenu(false);
    setShowLevelMenu(false);
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
      const enemyLevelMultiplier = level === 1 ? 0.6 : level === 2 ? 0.8 : 1;

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
        const enemySpeed = enemy.speed * game.difficultyScale * enemyLevelMultiplier;
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
        // Platform shadow
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.fillRect(platform.x, platform.y + platform.h, platform.w, 3);
        
        // Platform top
        context.fillStyle = theme.platformTop;
        context.fillRect(platform.x, platform.y, platform.w, 6);
        
        // Platform side
        context.fillStyle = theme.platformSide;
        context.fillRect(platform.x, platform.y + 6, platform.w, platform.h - 6);
        
        // Platform edge highlight
        context.strokeStyle = 'rgba(255,255,255,0.1)';
        context.lineWidth = 1;
        context.strokeRect(platform.x, platform.y, platform.w, 6);
      }

      for (const obstacle of game.obstacles) {
        // Obstacle shadow
        context.fillStyle = 'rgba(0,0,0,0.25)';
        context.beginPath();
        context.moveTo(obstacle.x, obstacle.y + obstacle.h + 2);
        context.lineTo(obstacle.x + obstacle.w / 2, obstacle.y + 2);
        context.lineTo(obstacle.x + obstacle.w, obstacle.y + obstacle.h + 2);
        context.closePath();
        context.fill();
        
        // Obstacle spike
        context.fillStyle = theme.obstacle;
        context.beginPath();
        context.moveTo(obstacle.x, obstacle.y + obstacle.h);
        context.lineTo(obstacle.x + obstacle.w / 2, obstacle.y);
        context.lineTo(obstacle.x + obstacle.w, obstacle.y + obstacle.h);
        context.closePath();
        context.fill();
        
        // Spike highlight
        context.strokeStyle = 'rgba(255,255,255,0.15)';
        context.lineWidth = 1;
        context.stroke();
      }

      for (const coin of game.coins) {
        if (coin.collected) continue;
        const pulse = 1 + Math.sin((game.time + coin.x) * 0.06) * 0.1;
        
        // Coin shadow
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.beginPath();
        context.arc(coin.x, coin.y + 3, 10 * pulse * 0.7, 0, Math.PI * 2);
        context.fill();
        
        // Coin glow
        context.strokeStyle = mode === 'classic' ? 'rgba(255,255,255,0.3)' : 'rgba(245,158,11,0.4)';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(coin.x, coin.y, 10 * pulse + 2, 0, Math.PI * 2);
        context.stroke();
        
        // Coin
        context.beginPath();
        context.fillStyle = theme.coin;
        context.arc(coin.x, coin.y, 10 * pulse, 0, Math.PI * 2);
        context.fill();
        
        // Coin shine
        context.fillStyle = 'rgba(255,255,255,0.4)';
        context.beginPath();
        context.arc(coin.x - 3, coin.y - 3, 3, 0, Math.PI * 2);
        context.fill();
        
        // Coin slot
        context.fillStyle = mode === 'classic' ? '#0a0a0a' : '#78350f';
        context.fillRect(coin.x - 2, coin.y - 7, 4, 14);
      }

      for (const enemy of game.enemies) {
        // Enemy shadow
        context.fillStyle = 'rgba(0,0,0,0.25)';
        context.fillRect(enemy.x, enemy.y + enemy.h + 1, enemy.w, 2);
        
        // Enemy body
        context.fillStyle = theme.enemy;
        context.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        
        // Enemy body shine/edge
        context.strokeStyle = 'rgba(255,255,255,0.1)';
        context.lineWidth = 1;
        context.strokeRect(enemy.x, enemy.y, enemy.w, enemy.h);
        
        // Enemy eyes
        context.fillStyle = mode === 'classic' ? '#d4d4d4' : '#fef2f2';
        context.fillRect(enemy.x + 6, enemy.y + 8, 6, 6);
        context.fillRect(enemy.x + 18, enemy.y + 8, 6, 6);
        
        // Eye pupils
        context.fillStyle = mode === 'classic' ? '#1f1f1f' : '#1e1b4b';
        const pupilShift = enemy.dir > 0 ? 2 : -2;
        context.beginPath();
        context.arc(enemy.x + 9 + pupilShift, enemy.y + 11, 1.5, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(enemy.x + 21 + pupilShift, enemy.y + 11, 1.5, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = nowTime < player.invulnerableUntil ? 0.4 + Math.abs(Math.sin(game.time * 0.2)) * 0.6 : 1;
      
      // Player shadow
      context.fillStyle = 'rgba(0,0,0,0.2)';
      context.fillRect(player.x, player.y + PLAYER_SIZE + 1, PLAYER_SIZE, 2);
      
      // Player body
      context.fillStyle = theme.player;
      context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
      
      // Player edge highlight
      context.strokeStyle = 'rgba(255,255,255,0.15)';
      context.lineWidth = 1.5;
      context.strokeRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
      
      // Player eyes (white part)
      context.fillStyle = mode === 'classic' ? '#eaeaea' : '#c7d2fe';
      context.fillRect(player.x + 6, player.y + 6, 6, 6);
      context.fillRect(player.x + 16, player.y + 6, 6, 6);
      
      // Player eyes (pupils)
      context.fillStyle = mode === 'classic' ? '#1f1f1f' : '#1e1b4b';
      const playerPupilShift = player.vx > 0 ? 2 : (player.vx < 0 ? -2 : 0);
      context.beginPath();
      context.arc(player.x + 9 + playerPupilShift, player.y + 9, 1.8, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(player.x + 19 + playerPupilShift, player.y + 9, 1.8, 0, Math.PI * 2);
      context.fill();
      
      // Player mouth
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
  }, [isOpen, level, status, mode, theme]);

  const handleOverlayClose = () => {
    if (Date.now() - openedAtRef.current < 500) return;
    onClose();
  };

  const isTablet = viewportWidth <= 1024;
  const isSmallMobile = viewportWidth <= 480;
  const isTinyMobile = viewportWidth <= 380;
  const isVeryShortViewport = viewportHeight <= 560;
  const isShortViewport = viewportHeight <= 720;
  const isLandscapeMobile = isMobile && viewportWidth > viewportHeight;
  const compactHeader = isSmallMobile || isLandscapeMobile;
  const headerPadding = compactHeader ? '0.85rem 1rem' : '1.5rem';
  const contentPadding = isSmallMobile ? '0.55rem' : isLandscapeMobile ? '0.7rem 0.85rem 0.85rem' : '1rem 1.2rem 1.2rem';
  const modeFontSize = isTinyMobile ? '0.72rem' : isSmallMobile ? '0.78rem' : '0.9rem';
  const modePadding = isTinyMobile ? '0.27rem 0.5rem' : isSmallMobile ? '0.32rem 0.6rem' : '0.4rem 0.75rem';
  const overlayInset = isSmallMobile ? '0.45rem' : '0.62rem';
  const controlBtnSize = isLandscapeMobile ? 46 : isTinyMobile ? 52 : isSmallMobile ? 58 : 65;
  const jumpBtnSize = isLandscapeMobile ? 54 : isTinyMobile ? 62 : isSmallMobile ? 68 : 75;
  const hudTop = isSmallMobile ? '0.55rem' : '0.7rem';
  const hudSide = isSmallMobile ? '0.52rem' : '0.72rem';
  const hudBadgePadding = isTinyMobile ? '0.22rem 0.45rem' : isSmallMobile ? '0.24rem 0.5rem' : '0.3rem 0.58rem';
  const hudBadgeFont = isTinyMobile ? '0.72rem' : isSmallMobile ? '0.78rem' : '0.86rem';
  const modeToggleTop = isSmallMobile ? '0.55rem' : '0.7rem';
  const levelToggleTop = isLandscapeMobile ? '0.55rem' : isSmallMobile ? '2.55rem' : '3.05rem';
  const levelToggleRight = isLandscapeMobile ? (isSmallMobile ? '5.35rem' : '5.75rem') : hudSide;
  const menuMinWidth = isTinyMobile ? '108px' : isSmallMobile ? '120px' : '140px';
  const gameMinHeight = isLandscapeMobile ? '38vh' : isVeryShortViewport ? '40vh' : isSmallMobile ? '44vh' : isMobile ? '50vh' : '60vh';
  const canvasMinHeight = isLandscapeMobile ? '34vh' : isVeryShortViewport ? '36vh' : isShortViewport ? '42vh' : isSmallMobile ? '44vh' : isMobile ? '50vh' : '60vh';
  const canvasMaxHeight = isLandscapeMobile ? '54vh' : isVeryShortViewport ? '58vh' : isSmallMobile ? '66vh' : isMobile ? '76vh' : '84vh';

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
            style={{
              width: '100%',
              maxWidth: isTablet ? '99vw' : '980px',
              maxHeight: isMobile ? '100dvh' : '92vh',
              overflowY: 'auto',
              background: '#020617',
              border: '1px solid #1e293b',
            }}
          >
            <div className="modal-header" style={{ background: 'transparent', borderBottom: '1px solid #1e293b', padding: headerPadding }}>
              <h3 style={{ color: '#e2e8f0', fontSize: compactHeader ? '1.08rem' : '1.5rem' }}>Retro Platformer X</h3>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ padding: contentPadding }}>
              <div style={{ width: '100%', overflow: 'hidden', borderRadius: isSmallMobile ? '0.6rem' : '0.75rem', border: '1px solid #334155', background: '#000', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', position: 'relative', minHeight: gameMinHeight }}>
                <div style={{ position: 'absolute', top: hudTop, left: hudSide, zIndex: 8, display: 'flex', gap: '0.38rem', flexWrap: 'wrap', maxWidth: '64%' }}>
                  <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudBadgePadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudBadgeFont }}>Score: {score}</span>
                  <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudBadgePadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudBadgeFont }}>Coins: {coins}</span>
                  <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudBadgePadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudBadgeFont }}>Lives: {lives}</span>
                </div>

                <div ref={modeMenuRef} style={{ position: 'absolute', top: modeToggleTop, right: hudSide, zIndex: 9 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModeMenu((prev) => !prev);
                      setShowLevelMenu(false);
                    }}
                    aria-label="Open mode menu"
                    style={{
                      padding: modePadding,
                      borderRadius: '0.45rem',
                      border: '1px solid #334155',
                      background: 'rgba(15,23,42,0.92)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: modeFontSize,
                      fontWeight: 700,
                      minWidth: isTinyMobile ? '70px' : '84px',
                    }}
                  >
                    Mode {showModeMenu ? '▲' : '▼'}
                  </button>

                  {showModeMenu && (
                    <div style={{ marginTop: '0.35rem', display: 'grid', gap: '0.35rem', background: 'rgba(2,6,23,0.95)', border: '1px solid #334155', borderRadius: '0.6rem', padding: isSmallMobile ? '0.32rem' : '0.4rem', minWidth: menuMinWidth, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('classic');
                          setShowModeMenu(false);
                        }}
                        style={{
                          padding: modePadding,
                          borderRadius: '0.45rem',
                          border: mode === 'classic' ? '1px solid #fafafa' : '1px solid #334155',
                          background: mode === 'classic' ? '#1f2937' : '#0f172a',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: modeFontSize,
                        }}
                      >
                        Classic Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('modern');
                          setShowModeMenu(false);
                        }}
                        style={{
                          padding: modePadding,
                          borderRadius: '0.45rem',
                          border: mode === 'modern' ? '1px solid #38bdf8' : '1px solid #334155',
                          background: mode === 'modern' ? '#0b3a63' : '#0f172a',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: modeFontSize,
                        }}
                      >
                        Modern Mode
                      </button>
                    </div>
                  )}
                </div>

                <div ref={levelMenuRef} style={{ position: 'absolute', top: levelToggleTop, right: levelToggleRight, zIndex: 9 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLevelMenu((prev) => !prev);
                      setShowModeMenu(false);
                    }}
                    aria-label="Open level menu"
                    style={{
                      padding: modePadding,
                      borderRadius: '0.45rem',
                      border: '1px solid #334155',
                      background: 'rgba(15,23,42,0.92)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: modeFontSize,
                      fontWeight: 700,
                      minWidth: isTinyMobile ? '70px' : '84px',
                    }}
                  >
                    Level {showLevelMenu ? '▲' : '▼'}
                  </button>

                  {showLevelMenu && (
                    <div style={{ marginTop: '0.35rem', display: 'grid', gap: '0.35rem', background: 'rgba(2,6,23,0.95)', border: '1px solid #334155', borderRadius: '0.6rem', padding: isSmallMobile ? '0.32rem' : '0.4rem', minWidth: menuMinWidth, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel(1);
                          setShowLevelMenu(false);
                        }}
                        style={{
                          padding: modePadding,
                          borderRadius: '0.45rem',
                          border: level === 1 ? '1px solid #f8fafc' : '1px solid #334155',
                          background: level === 1 ? '#1f2937' : '#0f172a',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: modeFontSize,
                        }}
                      >
                        Level 1 (Slow)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel(2);
                          setShowLevelMenu(false);
                        }}
                        style={{
                          padding: modePadding,
                          borderRadius: '0.45rem',
                          border: level === 2 ? '1px solid #f8fafc' : '1px solid #334155',
                          background: level === 2 ? '#1f2937' : '#0f172a',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: modeFontSize,
                        }}
                      >
                        Level 2 (Medium)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel(3);
                          setShowLevelMenu(false);
                        }}
                        style={{
                          padding: modePadding,
                          borderRadius: '0.45rem',
                          border: level === 3 ? '1px solid #38bdf8' : '1px solid #334155',
                          background: level === 3 ? '#0b3a63' : '#0f172a',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: modeFontSize,
                        }}
                      >
                        Level 3 (Current)
                      </button>
                    </div>
                  )}
                </div>

                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                    minHeight: canvasMinHeight,
                    maxHeight: canvasMaxHeight,
                    display: 'block',
                    touchAction: 'none',
                  }}
                />

                {status === 'gameover' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      inset: overlayInset,
                      background: 'rgba(2, 6, 23, 0.78)',
                      borderRadius: isSmallMobile ? '0.6rem' : '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(2px)',
                      zIndex: 10,
                    }}
                  >
                    <div style={{ textAlign: 'center', color: '#f8fafc', padding: isTinyMobile ? '0.6rem' : '1rem' }}>
                      <h2 style={{ marginBottom: '0.4rem', fontSize: isSmallMobile ? '1.35rem' : '1.8rem' }}>Game Over</h2>
                      <p style={{ marginBottom: '0.9rem', fontSize: isSmallMobile ? '0.9rem' : '1rem' }}>Final Score: {score} | Coins: {coins} | Level: {level}</p>
                      <button
                        type="button"
                        onClick={resetAll}
                        style={{
                          padding: isSmallMobile ? '0.54rem 0.95rem' : '0.6rem 1.1rem',
                          borderRadius: '0.55rem',
                          border: 'none',
                          background: '#22c55e',
                          color: '#052e16',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: isSmallMobile ? '0.85rem' : '0.95rem',
                        }}
                      >
                        Restart Game
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mobile Touch Controls */}
              {isMobile && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: isSmallMobile ? '0.9rem' : '1.2rem', padding: isSmallMobile ? '0 0.1rem' : '0 0.5rem', gap: '0.9rem', flexWrap: isTinyMobile ? 'wrap' : 'nowrap' }}>
                    <div style={{ display: 'flex', gap: isSmallMobile ? '0.75rem' : '1.2rem' }}>
                      <button
                        type="button"
                        onTouchStart={(e) => { e.preventDefault(); keysRef.current.left = true; }}
                        onTouchEnd={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                        onTouchCancel={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                        onMouseDown={(e) => { e.preventDefault(); keysRef.current.left = true; }}
                        onMouseUp={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                        onMouseLeave={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                        style={{
                          width: `${controlBtnSize}px`, height: `${controlBtnSize}px`, borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #1e293b)', border: 'none', color: 'white', fontSize: isSmallMobile ? '1.25rem' : '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', touchAction: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                        }}
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onTouchStart={(e) => { e.preventDefault(); keysRef.current.right = true; }}
                        onTouchEnd={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                        onTouchCancel={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                        onMouseDown={(e) => { e.preventDefault(); keysRef.current.right = true; }}
                        onMouseUp={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                        onMouseLeave={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                        style={{
                          width: `${controlBtnSize}px`, height: `${controlBtnSize}px`, borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #1e293b)', border: 'none', color: 'white', fontSize: isSmallMobile ? '1.25rem' : '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', touchAction: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                        }}
                      >
                        ▶
                      </button>
                    </div>
                    <button
                      type="button"
                      onTouchStart={(e) => { e.preventDefault(); keysRef.current.jump = true; }}
                      onTouchEnd={(e) => { e.preventDefault(); keysRef.current.jump = false; }}
                      onTouchCancel={(e) => { e.preventDefault(); keysRef.current.jump = false; }}
                      onMouseDown={(e) => { e.preventDefault(); keysRef.current.jump = true; }}
                      onMouseUp={(e) => { e.preventDefault(); keysRef.current.jump = false; }}
                      onMouseLeave={(e) => { e.preventDefault(); keysRef.current.jump = false; }}
                      style={{
                        width: `${jumpBtnSize}px`, height: `${jumpBtnSize}px`, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', color: 'white', fontSize: isSmallMobile ? '1.65rem' : '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', touchAction: 'none', boxShadow: '0 6px 16px rgba(37,99,235,0.5)', marginLeft: isTinyMobile ? 'auto' : '0'
                      }}
                    >
                      ▲
                    </button>
                  </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RetroPlatformerGame;
