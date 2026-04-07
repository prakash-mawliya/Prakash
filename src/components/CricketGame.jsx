import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 820;
const CANVAS_HEIGHT = 460;
const MAX_WICKETS = 3;
const LEADERBOARD_KEY = 'nokia_cricket_leaderboard_v2';
const HIGH_SCORE_KEY = 'nokia_cricket_hs_v2';

const CricketGame = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const openedAtRef = useRef(0);
    const frameCounterRef = useRef(0);
    const nextBallTimeoutRef = useRef(null);
    const bgmIntervalRef = useRef(null);
    const audioContextRef = useRef(null);

    const [gameState, setGameState] = useState('menu');
    const [gameMode, setGameMode] = useState('modern');
    const [score, setScore] = useState(0);
    const [balls, setBalls] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [bgmEnabled, setBgmEnabled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showModeMenu, setShowModeMenu] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setViewportWidth(width);
            setIsMobile(width <= 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scoreRef = useRef(0);
    const ballsRef = useRef(0);
    const wicketsRef = useRef(0);
    const modeMenuRef = useRef(null);

    useEffect(() => {
        if (!showModeMenu) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!modeMenuRef.current?.contains(event.target)) {
                setShowModeMenu(false);
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
    }, [showModeMenu]);

    const gameRef = useRef({
        bgScroll: 0,
        crowdPulse: 0,
        shake: 0,
        message: { text: '', color: '#ffffff', timer: 0, scale: 1 },
        particles: [],
        bowler: { x: 90, y: 330, arm: 0 },
        batsman: { x: 690, y: 330, isSwinging: false, swingTimer: 0 },
        ball: {
            x: 115,
            y: 345,
            r: 7,
            vx: 0,
            vy: 0,
            speed: 0,
            state: 'idle',
            active: false,
            deliveryResolved: false,
            deliveryRuns: 0,
            shotType: '',
        },
    });

    const ensureAudio = useCallback(() => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        } catch {
            // Silent fallback when browser blocks audio context
        }
    }, []);

    const playTone = useCallback((frequency, duration, type = 'square', volume = 0.08) => {
        if (!audioContextRef.current) return;
        try {
            const context = audioContextRef.current;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            gain.gain.setValueAtTime(volume, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + duration);
        } catch {
            // Silent fallback
        }
    }, []);

    const playSfx = useCallback((kind) => {
        ensureAudio();
        if (kind === 'hit') {
            playTone(gameMode === 'classic' ? 280 : 360, 0.07, gameMode === 'classic' ? 'square' : 'triangle', 0.1);
        }
        if (kind === 'cheer') {
            playTone(gameMode === 'classic' ? 420 : 650, 0.18, 'triangle', 0.08);
        }
        if (kind === 'out') {
            playTone(gameMode === 'classic' ? 140 : 180, 0.35, 'sawtooth', 0.09);
        }
        if (kind === 'bowl') {
            playTone(gameMode === 'classic' ? 220 : 300, 0.05, 'sine', 0.06);
        }
    }, [ensureAudio, gameMode, playTone]);

    const pushScoreToLeaderboard = useCallback((finalScore) => {
        const saved = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
        const updated = [...saved, finalScore]
            .filter((value) => Number.isFinite(value))
            .sort((a, b) => b - a)
            .slice(0, 5);
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
        setLeaderboard(updated);

        const savedHigh = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
        if (finalScore > savedHigh) {
            localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
            setHighScore(finalScore);
        }
    }, []);

    const resetGameObjects = () => {
        gameRef.current = {
            bgScroll: 0,
            crowdPulse: 0,
            shake: 0,
            message: { text: '', color: '#ffffff', timer: 0, scale: 1 },
            particles: [],
            bowler: { x: 90, y: 330, arm: 0 },
            batsman: { x: 690, y: 330, isSwinging: false, swingTimer: 0 },
            ball: {
                x: 115,
                y: 345,
                r: 7,
                vx: 0,
                vy: 0,
                speed: 0,
                state: 'idle',
                active: false,
                deliveryResolved: false,
                deliveryRuns: 0,
                shotType: '',
            },
        };
        frameCounterRef.current = 0;
    };

    const resetMatch = useCallback(() => {
        resetGameObjects();
        scoreRef.current = 0;
        ballsRef.current = 0;
        wicketsRef.current = 0;
        setScore(0);
        setBalls(0);
        setWickets(0);
    }, []);

    const spawnBall = useCallback(() => {
        const game = gameRef.current;
        const difficulty = Math.min(1 + ballsRef.current * 0.03, 2.1);
        const speed = 5.2 * difficulty + Math.random() * 2;

        game.ball.x = 115;
        game.ball.y = 325 + Math.random() * 34;
        game.ball.vx = speed;
        game.ball.vy = 0;
        game.ball.speed = speed;
        game.ball.state = 'bowling';
        game.ball.active = true;
        game.ball.deliveryResolved = false;
        game.ball.deliveryRuns = 0;
        game.ball.shotType = '';
        playSfx('bowl');
    }, [playSfx]);

    const setMidMessage = (text, color, scale = 1.2, timer = 80) => {
        gameRef.current.message = { text, color, scale, timer };
    };

    const scheduleNextBall = useCallback((delay = 900) => {
        if (nextBallTimeoutRef.current) clearTimeout(nextBallTimeoutRef.current);
        nextBallTimeoutRef.current = setTimeout(() => {
            if (wicketsRef.current < MAX_WICKETS && gameState === 'playing') {
                spawnBall();
            }
        }, delay);
    }, [gameState, spawnBall]);

    const endDelivery = useCallback((isWicket) => {
        const game = gameRef.current;
        if (game.ball.deliveryResolved) return;
        game.ball.deliveryResolved = true;
        game.ball.active = false;
        game.ball.state = 'idle';

        ballsRef.current += 1;
        setBalls(ballsRef.current);

        if (isWicket) {
            wicketsRef.current += 1;
            setWickets(wicketsRef.current);
            setMidMessage('WICKET!', '#ef4444', 1.7, 95);
            game.shake = 14;
            playSfx('out');

            if (wicketsRef.current >= MAX_WICKETS) {
                setGameState('gameover');
                pushScoreToLeaderboard(scoreRef.current);
                return;
            }
            scheduleNextBall(1050);
            return;
        }

        scheduleNextBall(900);
    }, [playSfx, pushScoreToLeaderboard, scheduleNextBall]);

    const handleHit = useCallback(() => {
        if (gameState !== 'playing') return;

        ensureAudio();
        const game = gameRef.current;
        const { ball, batsman } = game;
        if (ball.state !== 'bowling' || !ball.active || batsman.isSwinging) return;

        batsman.isSwinging = true;
        batsman.swingTimer = 14;

        const timingOffset = ball.x - (batsman.x - 28);
        const absOffset = Math.abs(timingOffset);

        if (absOffset <= 12) {
            ball.state = 'hit';
            ball.shotType = 'Lofted';
            ball.vx = 9.8;
            ball.vy = -12.8;
            ball.deliveryRuns = 6;
            scoreRef.current += 6;
            setScore(scoreRef.current);
            setMidMessage('SIX • LOFTED!', '#fde047', 1.8, 95);
            game.crowdPulse = 65;
            game.shake = 12;
            playSfx('hit');
            playSfx('cheer');
        } else if (absOffset <= 24) {
            ball.state = 'hit';
            ball.shotType = 'Ground';
            ball.vx = 14.5;
            ball.vy = -3.2;
            ball.deliveryRuns = 4;
            scoreRef.current += 4;
            setScore(scoreRef.current);
            setMidMessage('FOUR • DRIVE!', '#ffffff', 1.45, 80);
            game.crowdPulse = 40;
            playSfx('hit');
            playSfx('cheer');
        } else if (absOffset <= 38) {
            ball.state = 'hit';
            ball.shotType = 'Edge';
            ball.vx = 7.2;
            ball.vy = -6.4;
            ball.deliveryRuns = 2;
            scoreRef.current += 2;
            setScore(scoreRef.current);
            setMidMessage('EDGE • 2 RUNS', '#93c5fd', 1.2, 70);
            playSfx('hit');
        } else if (absOffset <= 52) {
            const safeEdge = Math.random() > 0.45;
            if (safeEdge) {
                ball.state = 'hit';
                ball.shotType = 'Late Edge';
                ball.vx = 5.2;
                ball.vy = -4.2;
                ball.deliveryRuns = 1;
                scoreRef.current += 1;
                setScore(scoreRef.current);
                setMidMessage('LATE EDGE • 1', '#cbd5e1', 1.1, 65);
                playSfx('hit');
            } else {
                endDelivery(true);
            }
        }
    }, [endDelivery, ensureAudio, gameState, playSfx]);

    const startGameInMode = useCallback((mode) => {
        setGameMode(mode);
        setGameState('playing');
        setShowModeMenu(false);
        resetMatch();
        ensureAudio();
        setTimeout(() => {
            spawnBall();
        }, 240);
    }, [ensureAudio, resetMatch, spawnBall]);

    useEffect(() => {
        if (!isOpen) return;
        openedAtRef.current = Date.now();

        const savedHigh = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
        const savedBoard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');

        const timeoutId = setTimeout(() => {
            setGameState('menu');
            setGameMode('modern');
            resetMatch();
            setHighScore(savedHigh);
            setLeaderboard(Array.isArray(savedBoard) ? savedBoard.slice(0, 5) : []);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [isOpen, resetMatch]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (event) => {
            if (event.code === 'Space' || event.code === 'ArrowUp') {
                event.preventDefault();
                if (gameState === 'menu') {
                    startGameInMode(gameMode);
                } else if (gameState === 'gameover') {
                    startGameInMode(gameMode);
                } else {
                    handleHit();
                }
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [gameMode, gameState, handleHit, isOpen, startGameInMode]);

    useEffect(() => {
        if (!isOpen || gameState !== 'playing' || !bgmEnabled) {
            if (bgmIntervalRef.current) {
                clearInterval(bgmIntervalRef.current);
                bgmIntervalRef.current = null;
            }
            return;
        }

        ensureAudio();
        const notesClassic = [220, 247, 196, 220, 262];
        const notesModern = [330, 392, 440, 392, 349];
        let index = 0;

        bgmIntervalRef.current = setInterval(() => {
            const notes = gameMode === 'classic' ? notesClassic : notesModern;
            const freq = notes[index % notes.length];
            playTone(freq, 0.11, gameMode === 'classic' ? 'square' : 'sine', 0.03);
            index += 1;
        }, gameMode === 'classic' ? 280 : 220);

        return () => {
            if (bgmIntervalRef.current) {
                clearInterval(bgmIntervalRef.current);
                bgmIntervalRef.current = null;
            }
        };
    }, [bgmEnabled, ensureAudio, gameMode, gameState, isOpen, playTone]);

    useEffect(() => {
        if (!isOpen) return;

        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) {
                animationRef.current = requestAnimationFrame(loop);
                return;
            }
            const context = canvas.getContext('2d');
            const game = gameRef.current;
            const isClassic = gameMode === 'classic';

            frameCounterRef.current += 1;
            const shouldStep = !isClassic || frameCounterRef.current % 2 === 0;

            if (shouldStep && gameState === 'playing') {
                game.bgScroll += isClassic ? 0.4 : 1.3;
                game.bowler.arm = Math.sin(frameCounterRef.current * 0.2) * 0.8;

                const { ball, batsman, particles } = game;

                if (ball.active && ball.state === 'bowling') {
                    ball.x += ball.vx;
                    if (ball.x > batsman.x + 30) {
                        endDelivery(true);
                    }
                } else if (ball.active && ball.state === 'hit') {
                    ball.x += ball.vx;
                    ball.y += ball.vy;
                    ball.vy += isClassic ? 0.42 : 0.5;
                    ball.vx *= 0.992;

                    if (ball.y > 400) {
                        ball.y = 400;
                        ball.vy *= -0.52;
                        ball.vx *= 0.88;
                    }

                    if (
                        ball.x > CANVAS_WIDTH + 40 ||
                        ball.x < -40 ||
                        ball.y < -60 ||
                        (Math.abs(ball.vx) < 0.18 && Math.abs(ball.vy) < 0.18 && ball.y >= 399)
                    ) {
                        endDelivery(false);
                    }
                }

                if (batsman.swingTimer > 0) {
                    batsman.swingTimer -= 1;
                } else {
                    batsman.isSwinging = false;
                }

                for (let index = particles.length - 1; index >= 0; index -= 1) {
                    const particle = particles[index];
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life -= 0.04;
                    if (particle.life <= 0) particles.splice(index, 1);
                }

                if (game.shake > 0.4) game.shake *= 0.9;
                if (game.crowdPulse > 0) game.crowdPulse -= 1;
                if (game.message.timer > 0) game.message.timer -= 1;
            }

            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            context.save();

            if (gameRef.current.shake > 0.5) {
                const sx = (Math.random() - 0.5) * gameRef.current.shake;
                const sy = (Math.random() - 0.5) * gameRef.current.shake;
                context.translate(sx, sy);
            }

            if (isClassic) {
                context.fillStyle = '#9fb48a';
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                context.fillStyle = '#6f8061';
                for (let line = 0; line < CANVAS_HEIGHT; line += 3) {
                    context.fillRect(0, line, CANVAS_WIDTH, 1);
                }
            } else {
                const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                gradient.addColorStop(0, '#3b82f6');
                gradient.addColorStop(0.45, '#60a5fa');
                gradient.addColorStop(0.52, '#dbeafe');
                gradient.addColorStop(0.53, '#65a30d');
                gradient.addColorStop(1, '#22c55e');
                context.fillStyle = gradient;
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Clouds with shadows
                const cloudShift = (gameRef.current.bgScroll * 0.2) % (CANVAS_WIDTH + 180);
                context.fillStyle = 'rgba(0,0,0,0.08)';
                for (let i = -1; i < 5; i += 1) {
                    const cx = i * 220 - cloudShift;
                    context.beginPath();
                    context.arc(cx + 46, 73, 24, 0, Math.PI * 2);
                    context.arc(cx + 71, 68, 28, 0, Math.PI * 2);
                    context.arc(cx + 96, 75, 22, 0, Math.PI * 2);
                    context.fill();
                }
                context.fillStyle = 'rgba(255,255,255,0.92)';
                for (let i = -1; i < 5; i += 1) {
                    const cx = i * 220 - cloudShift;
                    context.beginPath();
                    context.arc(cx + 45, 70, 24, 0, Math.PI * 2);
                    context.arc(cx + 70, 65, 28, 0, Math.PI * 2);
                    context.arc(cx + 95, 72, 22, 0, Math.PI * 2);
                    context.fill();
                }

                context.fillStyle = '#dde6ef';
                for (let i = 0; i < CANVAS_WIDTH; i += 18) {
                    const jump = gameRef.current.crowdPulse > 0 && i % 36 === 0 ? Math.sin(frameCounterRef.current * 0.25 + i) * 3.6 : 0;
                    context.beginPath();
                    context.arc(i, 195 + jump, 5, 0, Math.PI * 2);
                    context.fill();
                }
            }

            context.fillStyle = isClassic ? '#667651' : '#d5b48a';
            context.fillRect(70, 370, 680, 42);
            context.strokeStyle = isClassic ? '#1d2a16' : '#ffffff';
            context.lineWidth = 2;
            context.strokeRect(90, 370, 90, 42);
            context.strokeRect(650, 370, 90, 42);

            context.fillStyle = isClassic ? '#1d2a16' : '#f8fafc';
            context.fillRect(694, 318, 5, 52);
            context.fillRect(704, 318, 5, 52);
            context.fillRect(714, 318, 5, 52);

            const bowler = gameRef.current.bowler;
            context.fillStyle = isClassic ? '#1d2a16' : '#0f172a';
            context.beginPath();
            context.arc(bowler.x, bowler.y - 12, 9, 0, Math.PI * 2);
            context.fill();
            context.fillRect(bowler.x - 7, bowler.y, 14, 32);
            context.save();
            context.translate(bowler.x + 8, bowler.y + 8);
            context.rotate(gameState === 'playing' ? bowler.arm : 0);
            context.fillRect(0, 0, 20, 4);
            context.restore();

            const batsman = gameRef.current.batsman;
            const bx = batsman.x;
            const by = batsman.y;
            if (isClassic) {
                context.fillStyle = '#1d2a16';
                context.beginPath();
                context.arc(bx, by - 11, 9, 0, Math.PI * 2);
                context.fill();
                context.fillRect(bx - 7, by, 14, 35);
            } else {
                // Batsman shirt
                context.fillStyle = '#1e40af';
                context.shadowColor = 'rgba(0,0,0,0.3)';
                context.shadowBlur = 4;
                context.shadowOffsetX = 2;
                context.shadowOffsetY = 2;
                context.fillRect(bx - 10, by, 20, 28);
                context.shadowColor = 'transparent';
                
                // Batsman pants
                context.fillStyle = '#1f2937';
                context.fillRect(bx - 10, by + 27, 20, 20);
                
                // Head
                context.fillStyle = '#f8d2b7';
                context.beginPath();
                context.arc(bx, by - 12, 8, 0, Math.PI * 2);
                context.fill();
                
                // Face details
                context.fillStyle = '#374151';
                context.beginPath();
                context.arc(bx - 3, by - 13, 1.5, 0, Math.PI * 2);
                context.fill();
                context.beginPath();
                context.arc(bx + 3, by - 13, 1.5, 0, Math.PI * 2);
                context.fill();
            }

            context.save();
            context.translate(bx + 6, by + 10);
            const swingAngle = batsman.isSwinging ? -Math.PI / 1.9 : Math.PI / 3.5;
            context.rotate(swingAngle);
            context.fillStyle = '#92400e';
            context.shadowColor = 'rgba(0,0,0,0.4)';
            context.shadowBlur = 3;
            context.fillRect(-2, 0, 6, 44);
            context.shadowColor = 'transparent';
            context.restore();

            const ball = gameRef.current.ball;
            if (ball.active) {
                // Ball shadow
                if (!isClassic) {
                    context.fillStyle = 'rgba(0,0,0,0.2)';
                    context.beginPath();
                    context.arc(ball.x + 2, ball.y + 3, ball.r * 0.8, 0, Math.PI * 2);
                    context.fill();
                }
                
                // Ball glow
                if (!isClassic) {
                    context.strokeStyle = 'rgba(220,38,38,0.3)';
                    context.lineWidth = 3;
                    context.beginPath();
                    context.arc(ball.x, ball.y, ball.r + 2, 0, Math.PI * 2);
                    context.stroke();
                }
                
                // Ball
                context.beginPath();
                context.fillStyle = isClassic ? '#1d2a16' : '#dc2626';
                context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
                context.fill();
                
                // Ball seam
                if (!isClassic) {
                    context.strokeStyle = '#ffffff';
                    context.lineWidth = 1.2;
                    context.beginPath();
                    context.arc(ball.x, ball.y, ball.r - 1, 0, Math.PI * 2);
                    context.stroke();
                }
            }

            gameRef.current.particles.forEach((particle) => {
                context.globalAlpha = particle.life;
                context.fillStyle = isClassic ? '#1d2a16' : particle.color;
                context.fillRect(particle.x, particle.y, isClassic ? 2 : 4, isClassic ? 2 : 4);
            });
            context.globalAlpha = 1;

            const msg = gameRef.current.message;
            if (msg.timer > 0) {
                context.save();
                context.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 35);
                context.scale(msg.scale, msg.scale);
                context.fillStyle = isClassic ? '#1d2a16' : msg.color;
                context.font = isClassic ? 'bold 24px monospace' : 'bold 38px sans-serif';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                if (!isClassic) {
                    context.shadowColor = 'rgba(0,0,0,0.35)';
                    context.shadowBlur = 10;
                }
                context.fillText(msg.text, 0, 0);
                context.restore();
            }

            context.restore();
            animationRef.current = requestAnimationFrame(loop);
        };

        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [endDelivery, gameMode, gameState, isOpen]);

    useEffect(() => {
        return () => {
            if (nextBallTimeoutRef.current) clearTimeout(nextBallTimeoutRef.current);
            if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
        };
    }, []);

    const handleOverlayClose = () => {
        if (Date.now() - openedAtRef.current < 500) return;
        onClose();
    };

    const handleCanvasTap = () => {
        if (gameState === 'menu') {
            startGameInMode(gameMode);
            return;
        }
        if (gameState === 'gameover') {
            startGameInMode(gameMode);
            return;
        }
        handleHit();
    };

    const isTablet = viewportWidth <= 1024;
    const isSmallMobile = viewportWidth <= 480;
    const isTinyMobile = viewportWidth <= 380;
    const frameInset = gameMode === 'classic'
        ? (isSmallMobile ? '0.6rem' : '0.9rem')
        : (isSmallMobile ? '0.35rem' : '0.5rem');
    const gameContainerPadding = gameMode === 'classic'
        ? (isSmallMobile ? '0.55rem' : '0.8rem')
        : (isSmallMobile ? '0.35rem' : '0.5rem');
    const hudTop = gameMode === 'classic'
        ? (isSmallMobile ? '1rem' : '1.35rem')
        : (isSmallMobile ? '0.72rem' : '1rem');
    const hudSide = gameMode === 'classic'
        ? (isSmallMobile ? '1rem' : '1.35rem')
        : (isSmallMobile ? '0.72rem' : '1rem');
    const modeTop = gameMode === 'classic'
        ? (isSmallMobile ? '3.05rem' : '4.1rem')
        : (isSmallMobile ? '2.7rem' : '3.55rem');
    const hudFontSize = isTinyMobile ? '0.74rem' : isSmallMobile ? '0.79rem' : '0.9rem';
    const hudPadding = isTinyMobile ? '0.24rem 0.45rem' : isSmallMobile ? '0.28rem 0.5rem' : '0.32rem 0.58rem';
    const menuHeadingSize = isTinyMobile ? '1.28rem' : isSmallMobile ? '1.45rem' : '2rem';
    const menuTextSize = isSmallMobile ? '0.88rem' : '1rem';
    const actionBtnPadding = isSmallMobile ? '0.56rem 0.82rem' : '0.65rem 1rem';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                        maxWidth: isTablet ? '98vw' : '940px',
                        maxHeight: isMobile ? '96vh' : '92vh',
                        overflowY: 'auto',
                        background: '#020617',
                        border: '1px solid #1e293b',
                    }}
                >
                    <div className="modal-header" style={{ background: 'transparent', borderBottom: '1px solid #1e293b', alignItems: 'center', padding: isSmallMobile ? '1rem' : '1.5rem' }}>
                        <h3 style={{ color: '#f8fafc', fontSize: isSmallMobile ? '1.22rem' : '1.5rem' }}>Nokia Cricket Remastered</h3>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>

                    <div className="calculator-content" style={{ padding: isSmallMobile ? '0.7rem' : '1rem' }}>
                        <div style={{
                            background: gameMode === 'classic' ? '#7f8d73' : '#000',
                            border: gameMode === 'classic' ? (isSmallMobile ? '10px solid #2f3d25' : '14px solid #2f3d25') : '2px solid #334155',
                            borderRadius: gameMode === 'classic' ? (isSmallMobile ? '16px' : '22px') : (isSmallMobile ? '12px' : '14px'),
                            boxShadow: gameMode === 'classic' ? 'inset 0 0 0 3px #99a98b, 0 14px 30px rgba(0,0,0,0.4)' : '0 14px 30px rgba(0,0,0,0.45)',
                            padding: gameContainerPadding,
                            position: 'relative',
                            minHeight: isSmallMobile ? '43vh' : isMobile ? '50vh' : 'auto',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: hudTop,
                                left: hudSide,
                                zIndex: 8,
                                display: 'flex',
                                gap: '0.45rem',
                                flexWrap: 'wrap',
                                maxWidth: isSmallMobile ? '66%' : '60%',
                            }}>
                                <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudPadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudFontSize }}>Runs: {score}</span>
                                <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudPadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudFontSize }}>Wkts: {wickets}/{MAX_WICKETS}</span>
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: hudTop,
                                right: hudSide,
                                zIndex: 8,
                                display: 'flex',
                                gap: '0.45rem',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-end',
                                maxWidth: isSmallMobile ? '46%' : '40%',
                            }}>
                                <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudPadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudFontSize }}>Balls: {balls}</span>
                                <span style={{ background: 'rgba(15,23,42,0.88)', color: '#e2e8f0', padding: hudPadding, borderRadius: '0.45rem', border: '1px solid #334155', fontWeight: 600, fontSize: hudFontSize }}>High: {highScore}</span>
                            </div>

                            <div
                                ref={modeMenuRef}
                                style={{
                                    position: 'absolute',
                                    top: modeTop,
                                    right: hudSide,
                                    zIndex: 9,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowModeMenu((prev) => !prev)}
                                    style={{
                                        padding: isSmallMobile ? '0.3rem 0.58rem' : '0.34rem 0.72rem',
                                        borderRadius: '0.55rem',
                                        border: '1px solid #334155',
                                        background: 'rgba(2,6,23,0.9)',
                                        color: '#f8fafc',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: isSmallMobile ? '0.75rem' : '0.82rem',
                                    }}
                                >
                                    Mode {showModeMenu ? '▲' : '▼'}
                                </button>

                                {showModeMenu && (
                                    <div style={{
                                        marginTop: '0.35rem',
                                        display: 'grid',
                                        gap: '0.35rem',
                                        background: 'rgba(2,6,23,0.95)',
                                        border: '1px solid #334155',
                                        borderRadius: '0.6rem',
                                        padding: isSmallMobile ? '0.32rem' : '0.4rem',
                                        minWidth: isSmallMobile ? '112px' : '130px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGameMode('classic');
                                                setShowModeMenu(false);
                                            }}
                                            style={{
                                                padding: '0.36rem 0.6rem',
                                                borderRadius: '0.45rem',
                                                border: gameMode === 'classic' ? '1px solid #f8fafc' : '1px solid #334155',
                                                background: gameMode === 'classic' ? '#1f2937' : '#0f172a',
                                                color: '#f8fafc',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Classic
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGameMode('modern');
                                                setShowModeMenu(false);
                                            }}
                                            style={{
                                                padding: '0.36rem 0.6rem',
                                                borderRadius: '0.45rem',
                                                border: gameMode === 'modern' ? '1px solid #38bdf8' : '1px solid #334155',
                                                background: gameMode === 'modern' ? '#0b3a63' : '#0f172a',
                                                color: '#f8fafc',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Modern
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = !bgmEnabled;
                                                setBgmEnabled(next);
                                                if (next) ensureAudio();
                                                setShowModeMenu(false);
                                            }}
                                            style={{
                                                padding: '0.36rem 0.6rem',
                                                borderRadius: '0.45rem',
                                                border: '1px solid #334155',
                                                background: bgmEnabled ? '#14532d' : '#0f172a',
                                                color: '#f8fafc',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {bgmEnabled ? 'BGM On' : 'BGM Off'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {gameMode === 'classic' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0.45rem',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '90px',
                                    height: '8px',
                                    borderRadius: '99px',
                                    background: '#1f2b18',
                                }} />
                            )}

                            <canvas
                                ref={canvasRef}
                                width={CANVAS_WIDTH}
                                height={CANVAS_HEIGHT}
                                onClick={handleCanvasTap}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: isSmallMobile ? '58vh' : isMobile ? '72vh' : '70vh',
                                    minHeight: isSmallMobile ? '42vh' : isMobile ? '48vh' : 'auto',
                                    aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                                    display: 'block',
                                    borderRadius: gameMode === 'classic' ? '14px' : '10px',
                                    cursor: 'pointer',
                                }}
                            />

                            {gameState === 'menu' && (
                                <div style={{ position: 'absolute', inset: frameInset, background: 'rgba(2,6,23,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center', color: '#f8fafc', padding: isSmallMobile ? '0.6rem' : '1rem' }}>
                                        <h2 style={{ margin: '0 0 0.8rem 0', fontSize: menuHeadingSize, lineHeight: 1.15 }}>Nokia Cricket Remastered</h2>
                                        <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: menuTextSize, lineHeight: 1.35 }}>Space / Tap = Hit Shot • Timing controls shot type</p>
                                        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <button
                                                type="button"
                                                onClick={() => startGameInMode('classic')}
                                                style={{ padding: actionBtnPadding, borderRadius: '0.55rem', border: 'none', background: '#334155', color: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: isSmallMobile ? '0.85rem' : '0.95rem' }}
                                            >
                                                Play Classic
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => startGameInMode('modern')}
                                                style={{ padding: actionBtnPadding, borderRadius: '0.55rem', border: 'none', background: '#0284c7', color: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: isSmallMobile ? '0.85rem' : '0.95rem' }}
                                            >
                                                Play Modern
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {gameState === 'gameover' && (
                                <div style={{ position: 'absolute', inset: frameInset, background: 'rgba(2,6,23,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center', color: '#f8fafc', padding: isSmallMobile ? '0.6rem' : '1rem' }}>
                                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: isSmallMobile ? '1.35rem' : '1.8rem' }}>Game Over</h2>
                                        <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: isSmallMobile ? '0.9rem' : '1rem' }}>Score: {score} • Balls: {balls}</p>
                                        <button
                                            type="button"
                                            onClick={() => startGameInMode(gameMode)}
                                            style={{ padding: actionBtnPadding, borderRadius: '0.55rem', border: 'none', background: '#22c55e', color: '#052e16', cursor: 'pointer', fontWeight: 700, fontSize: isSmallMobile ? '0.85rem' : '0.95rem' }}
                                        >
                                            Restart Match
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{
                            marginTop: '0.75rem',
                            display: 'flex',
                            justifyContent: isMobile ? 'flex-start' : 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isSmallMobile ? '0.35rem' : '0.55rem',
                            color: '#94a3b8',
                            fontSize: isSmallMobile ? '0.82rem' : '0.9rem',
                            lineHeight: 1.35,
                        }}>
                            <span>Controls: Space / Tap to shoot • Early/Late timing affects shot</span>
                            <span>AI bowler speed increases over time</span>
                        </div>

                        {gameState === 'gameover' && (
                        <div style={{ marginTop: '0.75rem', border: '1px solid #1f2937', borderRadius: '0.6rem', padding: isSmallMobile ? '0.5rem' : '0.65rem', background: '#0b1220' }}>
                            <p style={{ margin: '0 0 0.45rem 0', color: '#e2e8f0', fontWeight: 600 }}>Leaderboard</p>
                            {leaderboard.length === 0 ? (
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: isSmallMobile ? '0.82rem' : '0.9rem' }}>No scores yet. Start a match and set a record.</p>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                                    {leaderboard.map((entry, index) => (
                                        <span key={`${entry}-${index}`} style={{ background: '#111827', color: '#e2e8f0', padding: isSmallMobile ? '0.28rem 0.5rem' : '0.32rem 0.6rem', borderRadius: '0.45rem', border: '1px solid #334155', fontSize: isSmallMobile ? '0.78rem' : '0.86rem' }}>
                                            #{index + 1} {entry}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CricketGame;