import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FlappyBird.css';
const PIPE_WIDTH = 60; // Width of the pipes

const BIRD_HEIGHT = 25; // Reduced bird height
const BIRD_WIDTH = 35;  // Reduced bird width
const getWindowDimensions = () => ({ width: window.innerWidth, height: window.innerHeight });
const GRAVITY = 0.45;
const JUMP_VELOCITY = -7.5;
const MAX_FALL_SPEED = 12;
const PHYSICS_SCALE = 35;
const INITIAL_PIPE_GAP = 150;  // Reduced gap for more challenge
const MIN_PIPE_GAP = 110;     // Reduced minimum gap
const MIN_PIPE_HEIGHT = 50;
const BIRD_LEFT_POSITION = 100;  // Move bird more to the right

const FlappyBirdGame = () => {
  const windowDimensions = getWindowDimensions();
  const GAME_WIDTH = windowDimensions.width;
  const GAME_HEIGHT = 400;
  const [birdPosition, setBirdPosition] = useState(() => GAME_HEIGHT / 2);
  const birdVelocity = useRef(0);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Difficulty settings
  const currentPipeSpeed = useRef(2.5); // Slightly slower initial speed
  const currentPipeGap = useRef(INITIAL_PIPE_GAP);
  const currentPipeInterval = useRef(1800); // Slightly more time between pipes

  const gameLoop = useRef(null);
  const lastTime = useRef(0);
  const lastPipeTime = useRef(0);

  const adjustDifficulty = useCallback(() => {
    // Increase speed every 10 points
    if (score > 0 && score % 10 === 0) {
      currentPipeSpeed.current = Math.min(currentPipeSpeed.current + 0.3, 6); // Reduced max speed
    }
    // Decrease gap every 15 points, but keep it playable
    if (score > 0 && score % 15 === 0) {
      currentPipeGap.current = Math.max(currentPipeGap.current - 5, MIN_PIPE_GAP);
    }
    // Decrease interval every 20 points
    if (score > 0 && score % 20 === 0) {
      currentPipeInterval.current = Math.max(currentPipeInterval.current - 100, 1000);
    }
  }, [score]);

  const gameTick = useCallback((timestamp) => {
    if (!lastTime.current) {
      lastTime.current = timestamp;
      gameLoop.current = requestAnimationFrame(gameTick);
      return;
    }

    const deltaTime = (timestamp - lastTime.current) / 1000; // seconds
    lastTime.current = timestamp;

    if (gameHasStarted && !gameOver) {
      // Bird physics with improved calculations
      const gravityThisFrame = GRAVITY * deltaTime * PHYSICS_SCALE;
      birdVelocity.current = Math.min(birdVelocity.current + gravityThisFrame, MAX_FALL_SPEED);
      
      // Add a slight curve to the jump for better feel
      if (birdVelocity.current < 0) {
        birdVelocity.current *= 0.95; // Smooths out the top of the jump arc
      }
      
      let newBirdPosition = birdPosition + birdVelocity.current;

      // Prevent bird from going out of bounds
      if (newBirdPosition > GAME_HEIGHT - BIRD_HEIGHT) {
        newBirdPosition = GAME_HEIGHT - BIRD_HEIGHT;
        setGameOver(true);
      } else if (newBirdPosition < 0) {
        newBirdPosition = 0;
        setGameOver(true);
      } else {
        setBirdPosition(newBirdPosition);
      }

      // Pipe movement and collision
      let collisionDetected = false;
      let scored = false;
      setPipes(currentPipes => {
        const newPipes = currentPipes.map(pipe => {
          const newLeft = pipe.left - currentPipeSpeed.current * deltaTime * 60;
          const birdLeft = BIRD_LEFT_POSITION;
          const birdRight = birdLeft + BIRD_WIDTH;
          const pipeRight = newLeft + PIPE_WIDTH;

          // Add a small buffer to make collision detection more forgiving
          const collisionBuffer = 5;
          if (birdRight - collisionBuffer > newLeft && birdLeft + collisionBuffer < pipeRight) {
            if (newBirdPosition + collisionBuffer < pipe.topPipeHeight || 
                newBirdPosition + BIRD_HEIGHT - collisionBuffer > GAME_HEIGHT - pipe.bottomPipeHeight) {
              collisionDetected = true;
            }
          }

          if (!pipe.passed && pipeRight < birdLeft) {
            scored = true;
            return { ...pipe, left: newLeft, passed: true };
          }
          return { ...pipe, left: newLeft };
        }).filter(pipe => pipe.left > -PIPE_WIDTH);

        if (scored) {
          setScore(s => s + 1);
          adjustDifficulty();
        }
        if (collisionDetected) setGameOver(true);

        return newPipes;
      });

      // Pipe generation
      if (timestamp - lastPipeTime.current > currentPipeInterval.current) {
        lastPipeTime.current = timestamp;
        // Ensure there's always enough space to pass through
        const availableHeight = GAME_HEIGHT - currentPipeGap.current - (2 * MIN_PIPE_HEIGHT);
        const randomHeight = Math.random() * availableHeight + MIN_PIPE_HEIGHT;
        setPipes(p => [
          ...p,
          {
            left: GAME_WIDTH,
            topPipeHeight: randomHeight,
            bottomPipeHeight: GAME_HEIGHT - randomHeight - currentPipeGap.current,
            passed: false,
          },
        ]);
      }
    }

    if (!gameOver) {
      gameLoop.current = requestAnimationFrame(gameTick);
    }
  }, [gameHasStarted, gameOver, birdPosition, GAME_HEIGHT, GAME_WIDTH, adjustDifficulty]);

  useEffect(() => {
    gameLoop.current = requestAnimationFrame(gameTick);
    return () => cancelAnimationFrame(gameLoop.current);
  }, [gameTick]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const handleJump = useCallback(() => {
    if (gameOver) return;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    birdVelocity.current = JUMP_VELOCITY;
  }, [gameOver, gameHasStarted]);

  const restartGame = useCallback(() => {
    setBirdPosition(GAME_HEIGHT / 2);
    birdVelocity.current = 0;
    setGameOver(false);
    setPipes([]);
    setScore(0);
    setGameHasStarted(true);
    lastTime.current = 0;
    lastPipeTime.current = 0;
    // Reset difficulty settings on restart
    currentPipeSpeed.current = 2.5;
    currentPipeGap.current = INITIAL_PIPE_GAP;
    currentPipeInterval.current = 1800;
  }, [GAME_HEIGHT]);

  // Handle restart button events (both click and touch)
  const handleRestartButton = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    restartGame();
  }, [restartGame]);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    const clickHandler = (e) => {
      // Only jump if click is inside the game area
      if (e.target.classList.contains('flappy-bird-container') ||
          e.target.closest('.flappy-bird-container')) {
        e.preventDefault();
        handleJump();
      }
    };

    const touchHandler = (e) => {
      // Don't handle touch events on buttons or menu elements
      if (e.target.tagName === 'BUTTON' ||
          e.target.closest('.menu') ||
          e.target.closest('button')) {
        return; // Let the button handle its own events
      }

      // Prevent scrolling and other touch behaviors for game area only
      e.preventDefault();
      e.stopPropagation();

      // Only jump if touch is inside the game area and game is active
      if ((e.target.classList.contains('flappy-bird-container') ||
           e.target.closest('.flappy-bird-container')) &&
          !gameOver) {
        handleJump();
      }
    };

    const gameContainer = document.querySelector('.flappy-bird-container');

    // Add event listeners
    window.addEventListener('keydown', keyHandler);
    gameContainer?.addEventListener('click', clickHandler);
    gameContainer?.addEventListener('touchstart', touchHandler, { passive: false });
    gameContainer?.addEventListener('touchend', touchHandler, { passive: false });

    return () => {
      window.removeEventListener('keydown', keyHandler);
      gameContainer?.removeEventListener('click', clickHandler);
      gameContainer?.removeEventListener('touchstart', touchHandler);
      gameContainer?.removeEventListener('touchend', touchHandler);
    };
  }, [handleJump]);

  const getBirdRotation = () => {
    if (!gameHasStarted) return 0;
    return Math.min(Math.max(birdVelocity.current * 3, -30), 90);
  };

  const [birdImgError, setBirdImgError] = useState(false);
  return (
    <div
      className="flappy-bird-container"
      style={{
        height: GAME_HEIGHT,
        width: '100%',
        margin: '32px auto',
        position: 'relative',
        maxWidth: '100vw',
        maxHeight: GAME_HEIGHT,
        touchAction: 'none', // Prevent scrolling on touch
        userSelect: 'none', // Prevent text selection
        cursor: 'pointer'
      }}
    >
      {/* Background layers */}
      <div
        className="background-layer"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-x'
        }}
      />
      {/* Ground layer removed for cleaner look with custom background */}
      
      {/* Bird */}
      {!birdImgError ? (
        <img
          src={process.env.PUBLIC_URL + '/bird.png'}
          alt="Flappy Bird Character"
          className="bird"
          style={{
            position: 'absolute',
            left: BIRD_LEFT_POSITION,
            transform: `translateY(${birdPosition}px) rotate(${getBirdRotation()}deg)`,
            height: BIRD_HEIGHT,
            width: BIRD_WIDTH,
            zIndex: 5
          }}
          onError={() => setBirdImgError(true)}
        />
      ) : (
        <div
          className="bird-fallback"
          style={{
            position: 'absolute',
            left: BIRD_LEFT_POSITION,
            transform: `translateY(${birdPosition}px) rotate(${getBirdRotation()}deg)`,
            height: BIRD_HEIGHT,
            width: BIRD_WIDTH,
            background: '#FFD700',
            borderRadius: '50%',
            border: '2px solid #333',
            zIndex: 5,
          }}
        />
      )}
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <div 
            className="topPipe" 
            style={{ 
              left: pipe.left, 
              height: pipe.topPipeHeight,
              top: 0,
              transform: 'translate3d(0,0,0)' // For smoother animation
            }} 
          />
          <div 
            className="pipe" 
            style={{ 
              left: pipe.left, 
              height: pipe.bottomPipeHeight,
              bottom: 0,
              transform: 'translate3d(0,0,0)' // For smoother animation
            }} 
          />
        </React.Fragment>
      ))}
      <div className="game-info">Score: {score} | High Score: {highScore}</div>
      {!gameHasStarted && !gameOver && (
        <div className="menu">
          <h2>Tap, Click or Press Space to Play</h2>
          <p style={{ fontSize: '16px', marginTop: '10px', opacity: 0.8 }}>
            Tap anywhere to make the bird fly!
          </p>
        </div>
      )}
      {gameOver && (
        <div className="menu">
          <h2>Game Over</h2>
          <button
            onClick={handleRestartButton}
            onTouchStart={handleRestartButton}
            onTouchEnd={(e) => e.preventDefault()}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer',
              padding: '15px 30px',
              fontSize: '18px',
              minWidth: '120px',
              minHeight: '48px'
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default FlappyBirdGame;