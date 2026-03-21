import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_WIDTH = 400; // 20 * 20
const CANVAS_HEIGHT = 400;

// Directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

const SnakeGame = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState(RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isAiMode, setIsAiMode] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100); // Speed in ms (lower is faster)

  // --- Game Logic Helper Functions ---

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection(RIGHT);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  // --- AI Pathfinding (BFS) ---
  const getAiMove = (currentSnake, currentFood) => {
    const head = currentSnake[0];
    const moves = [UP, DOWN, LEFT, RIGHT];
    
    // BFS to find shortest path to food
    const queue = [[head]];
    const visited = new Set();
    visited.add(`${head.x},${head.y}`);
    const parentMap = new Map(); // Key: coordStr, Value: { parentCoord, move }

    let foundPathEnd = null;

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current.x === currentFood.x && current.y === currentFood.y) {
        foundPathEnd = current;
        break;
      }

      for (const move of moves) {
        const next = { x: current.x + move.x, y: current.y + move.y };
        const nextStr = `${next.x},${next.y}`;

        // Check bounds
        if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) continue;
        
        // Check collision with snake (treat tail as open because it will move, unless just ate)
        // For simplicity, just avoid whole body
        if (currentSnake.some(s => s.x === next.x && s.y === next.y)) continue;

        if (!visited.has(nextStr)) {
          visited.add(nextStr);
          queue.push([...path, next]);
          parentMap.set(nextStr, { from: current, move: move });
        }
      }
    }

    if (foundPathEnd) {
        // Backtrack to find the first move
        let curr = foundPathEnd;
        let pathStack = [];
        while(curr.x !== head.x || curr.y !== head.y) {
            const info = parentMap.get(`${curr.x},${curr.y}`);
            if(!info) break;
            pathStack.push(info.move);
            curr = info.from;
        }
        return pathStack.pop();
    }

    // Fallback: If no path to food, just try to survive (pick any valid move)
    for (const move of moves) {
        const next = { x: head.x + move.x, y: head.y + move.y };
        if (next.x >= 0 && next.x < GRID_SIZE && next.y >= 0 && next.y < GRID_SIZE &&
            !currentSnake.some(s => s.x === next.x && s.y === next.y)) {
            return move;
        }
    }

    return direction; // Valid move not found, continue (will die)
  };


  // --- Game Loop ---
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      let nextDir = direction;

      if (isAiMode) {
        const aiMove = getAiMove(snake, food);
        if (aiMove) nextDir = aiMove;
        setDirection(nextDir);
      }

      const newHead = { x: snake[0].x + nextDir.x, y: snake[0].y + nextDir.y };

      // Check Collision with Walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      // Check Collision with Self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }

      setSnake(newSnake);
    }, speed); // User-controlled speed

    return () => clearInterval(gameLoop);
  }, [snake, direction, gameOver, isPlaying, isAiMode, food, generateFood, score, highScore, speed]);


  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAiMode) return;
      switch (e.key) {
        case 'ArrowUp': if (direction !== DOWN) setDirection(UP); break;
        case 'ArrowDown': if (direction !== UP) setDirection(DOWN); break;
        case 'ArrowLeft': if (direction !== RIGHT) setDirection(LEFT); break;
        case 'ArrowRight': if (direction !== LEFT) setDirection(RIGHT); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isAiMode]);

  // --- Rendering ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    
    // Nokia Colors
    const BG_COLOR = '#9bbc0f';
    const DOT_COLOR = '#0f380f';
    const GRID_COLOR = '#8bac0f';

    // Clear with Nokia Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Subtle Grid
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw Food (Pixelated Block)
    ctx.fillStyle = DOT_COLOR;
    ctx.fillRect(
        food.x * CELL_SIZE + 2, 
        food.y * CELL_SIZE + 2, 
        CELL_SIZE - 4, 
        CELL_SIZE - 4
    );
    // Inner dot for food detail
    ctx.clearRect(
        food.x * CELL_SIZE + 6, 
        food.y * CELL_SIZE + 6, 
        CELL_SIZE - 12, 
        CELL_SIZE - 12
    );


    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = DOT_COLOR;
      
      // Draw main block
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );

      // Connect segments visually
      if (index > 0) {
          const prev = snake[index - 1];
          if (prev.x === segment.x) {
              // Vertical connection
              ctx.fillRect(
                  segment.x * CELL_SIZE + 1,
                  Math.min(prev.y, segment.y) * CELL_SIZE + 10,
                  CELL_SIZE - 2,
                  CELL_SIZE - 10
              );
          } else {
              // Horizontal connection
              ctx.fillRect(
                  Math.min(prev.x, segment.x) * CELL_SIZE + 10,
                  segment.y * CELL_SIZE + 1,
                  CELL_SIZE - 10,
                  CELL_SIZE - 2
              );
          }
      }
    });

  }, [snake, food]); // Removed isAiMode dependency for visuals to keep it retro

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
            className="calculator-modal nokia-frame"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', background: '#455d3f', borderRadius: '30px', border: '8px solid #2b3f2a', padding: '20px' }}
          >
            <div className="modal-header" style={{ background: 'transparent', borderBottom: 'none', padding: '0 0 1rem 0' }}>
              <h3 style={{ fontFamily: 'monospace', color: '#9bbc0f', textShadow: '1px 1px 0 #0f380f' }}>NOKIA 3310</h3>
              <button className="close-btn" style={{ color: '#9bbc0f' }} onClick={onClose}>&times;</button>
            </div>

            <div className="calculator-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0' }}>
              
              <div className="nokia-screen-container" style={{ 
                  background: '#9bbc0f', 
                  padding: '10px', 
                  border: '4px solid #0f380f', 
                  borderRadius: '10px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
              }}>
                <div className="game-stats" style={{ color: '#0f380f', borderBottom: '1px solid #0f380f', paddingBottom: '5px', marginBottom: '5px' }}>
                    <span>SCORE:{score}</span>
                    <span>HI:{highScore}</span>
                </div>

                <canvas 
                    ref={canvasRef} 
                    width={CANVAS_WIDTH} 
                    height={CANVAS_HEIGHT}
                    className="game-canvas nokia-canvas"
                    style={{ border: 'none', boxShadow: 'none', borderRadius: '0' }}
                />
              </div>
              
              <div style={{ width: '100%', marginTop: '1.5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9bbc0f', fontFamily: 'monospace' }}>
                    <span>SPEED</span>
                    <span>{speed}ms</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="250" 
                  step="10" 
                  value={280 - speed} 
                  onChange={(e) => setSpeed(280 - Number(e.target.value))}
                  className="range-slider nokia-slider"
                  title="Adjust Speed"
                />
              </div>

              <div className="controls-row" style={{ marginTop: '1.5rem', justifyContent: 'center', gap: '15px', width: '100%' }}>
                {!isPlaying || gameOver ? (
                    <button 
                        onClick={resetGame}
                        style={{
                            background: '#2b3f2a',
                            color: '#9bbc0f',
                            border: '2px solid #9bbc0f',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 0 #1a2619',
                            fontSize: '1rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        {gameOver ? 'RETRY' : 'START'}
                    </button>
                ) : (
                   <button 
                        onClick={() => setIsPlaying(false)}
                        style={{
                            background: '#2b3f2a',
                            color: '#9bbc0f',
                            border: '2px solid #9bbc0f',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 0 #1a2619',
                            fontSize: '1rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        PAUSE
                    </button> 
                )}
                
                <button 
                    style={{ 
                        background: isAiMode ? '#9bbc0f' : '#2b3f2a',
                        color: isAiMode ? '#0f380f' : '#9bbc0f',
                        border: '2px solid #9bbc0f',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 0 #1a2619',
                        fontSize: '1rem',
                        textTransform: 'uppercase'
                    }}
                    onClick={() => {
                        setIsAiMode(!isAiMode);
                        if (!isAiMode && !isPlaying && !gameOver) setIsPlaying(true);
                    }}
                >
                    {isAiMode ? 'AI:ON' : 'AI:OFF'}
                </button>
              </div>
              <p className="hint-text" style={{marginTop: '1.5rem', fontFamily: 'monospace', color: '#8bac0f', fontSize: '0.8rem', textAlign: 'center' }}>
                  {isAiMode ? "AI MODE ACTIVE" : "USE ARROW KEYS"}
              </p>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SnakeGame;
