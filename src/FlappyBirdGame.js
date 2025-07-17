import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FlappyBird.css';

// Deployment timestamp: 2025-01-17

// Game constants optimized for smooth gameplay
const PIPE_WIDTH = 60;
const BIRD_HEIGHT = 25;
const BIRD_WIDTH = 35;
const getWindowDimensions = () => ({ width: window.innerWidth, height: window.innerHeight });

// Physics constants for smooth movement
const GRAVITY = 0.45;
const JUMP_VELOCITY = -7.5;
const MAX_FALL_SPEED = 12;
const PHYSICS_SCALE = 35;
const INITIAL_PIPE_GAP = 150;
const MIN_PIPE_GAP = 110;
const MIN_PIPE_HEIGHT = 50;
const BIRD_LEFT_POSITION = 100;

// Background scrolling constants for smooth animation
const BACKGROUND_SCROLL_SPEED = 1.5; // Pixels per frame - optimized for Vercel deployment

const FlappyBirdGame = () => {
  const windowDimensions = getWindowDimensions();
  const GAME_WIDTH = windowDimensions.width;
  const GAME_HEIGHT = Math.min(400, windowDimensions.height * 0.6); // Responsive height

  // Game state
  const [birdPosition, setBirdPosition] = useState(() => GAME_HEIGHT / 2);
  const birdVelocity = useRef(0);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Background scrolling state for smooth animation
  const backgroundOffset = useRef(0);
  const [backgroundPosition, setBackgroundPosition] = useState(0);

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

    const deltaTime = Math.min((timestamp - lastTime.current) / 1000, 1/30); // Cap delta time for stability
    lastTime.current = timestamp;

    // Smooth background scrolling - always animate for professional look
    backgroundOffset.current += BACKGROUND_SCROLL_SPEED;
    if (backgroundOffset.current >= GAME_WIDTH) {
      backgroundOffset.current = 0;
    }
    setBackgroundPosition(backgroundOffset.current);

    if (gameHasStarted && !gameOver) {
      // Enhanced bird physics with smoother calculations
      const gravityThisFrame = GRAVITY * deltaTime * PHYSICS_SCALE;
      birdVelocity.current = Math.min(birdVelocity.current + gravityThisFrame, MAX_FALL_SPEED);

      // Improved jump arc for more natural feel
      if (birdVelocity.current < 0) {
        birdVelocity.current *= 0.96; // Slightly smoother arc
      }

      let newBirdPosition = birdPosition + birdVelocity.current;

      // Smooth boundary collision with small buffer
      const boundaryBuffer = 2;
      if (newBirdPosition > GAME_HEIGHT - BIRD_HEIGHT - boundaryBuffer) {
        newBirdPosition = GAME_HEIGHT - BIRD_HEIGHT - boundaryBuffer;
        setGameOver(true);
      } else if (newBirdPosition < boundaryBuffer) {
        newBirdPosition = boundaryBuffer;
        setGameOver(true);
      } else {
        setBirdPosition(newBirdPosition);
      }

      // Enhanced pipe movement and collision with smoother calculations
      let collisionDetected = false;
      let scoreIncrement = 0;

      setPipes(currentPipes => {
        const newPipes = currentPipes.map(pipe => {
          // Smoother pipe movement with frame-rate independent speed
          const newLeft = pipe.left - currentPipeSpeed.current * deltaTime * 60;
          const birdLeft = BIRD_LEFT_POSITION;
          const birdRight = birdLeft + BIRD_WIDTH;
          const pipeLeft = newLeft;
          const pipeRight = newLeft + PIPE_WIDTH;



          // Fixed collision detection with proper coordinates
          const collisionBuffer = 2;
          const birdTop = newBirdPosition;
          const birdBottom = newBirdPosition + BIRD_HEIGHT;

          // Check if bird is horizontally within pipe bounds
          if (birdRight > pipeLeft + collisionBuffer && birdLeft < pipeRight - collisionBuffer) {
            // Check vertical collision with top pipe or bottom pipe
            if (birdTop < pipe.topPipeHeight - collisionBuffer ||
                birdBottom > GAME_HEIGHT - pipe.bottomPipeHeight + collisionBuffer) {
              collisionDetected = true;
            }
          }

          // Fixed scoring system - bird passes when pipe's right edge is past bird's left edge
          if (!pipe.passed && pipeRight < birdLeft) {
            scoreIncrement = 1;
            return { ...pipe, left: newLeft, passed: true };
          }

          return { ...pipe, left: newLeft };
        }).filter(pipe => pipe.left > -PIPE_WIDTH - 10);

        // Update score immediately if a pipe was passed
        if (scoreIncrement > 0) {
          setScore(prevScore => prevScore + scoreIncrement);
          adjustDifficulty();
        }

        if (collisionDetected) {
          setGameOver(true);
        }

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

    // Continue animation loop for smooth background even when game is over
    gameLoop.current = requestAnimationFrame(gameTick);
  }, [gameHasStarted, gameOver, birdPosition, GAME_HEIGHT, GAME_WIDTH, adjustDifficulty]);

  useEffect(() => {
    gameLoop.current = requestAnimationFrame(gameTick);
    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, [gameTick]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      // Save high score to localStorage for persistence
      localStorage.setItem('flappyBirdHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

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
    backgroundOffset.current = 0;
    setBackgroundPosition(0);
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
  }, [handleJump, gameOver]);

  const getBirdRotation = () => {
    if (!gameHasStarted) return 0;
    return Math.min(Math.max(birdVelocity.current * 3, -30), 90);
  };

  const [birdImgError, setBirdImgError] = useState(false);
  const [pipeImgError, setPipeImgError] = useState(false);

  // Calculate responsive dimensions
  const containerStyle = {
    height: GAME_HEIGHT,
    width: '100%',
    margin: '32px auto',
    position: 'relative',
    maxWidth: '100vw',
    maxHeight: GAME_HEIGHT,
    touchAction: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    borderRadius: windowDimensions.width <= 768 ? '0' : '8px',
    overflow: 'hidden'
  };

  return (
    <div className="flappy-bird-container" style={containerStyle}>
      {/* Smooth scrolling background with JavaScript control */}
      <div
        className="background-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
          backgroundSize: `${GAME_WIDTH}px 100%`,
          backgroundPosition: `${-backgroundPosition}px center`,
          backgroundRepeat: 'repeat-x',
          zIndex: 1,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Secondary background layer for seamless scrolling */}
      <div
        className="background-layer-secondary"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
          backgroundSize: `${GAME_WIDTH}px 100%`,
          backgroundPosition: `${GAME_WIDTH - backgroundPosition}px center`,
          backgroundRepeat: 'repeat-x',
          zIndex: 1,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Enhanced Bird with smooth animations */}
      {!birdImgError ? (
        <img
          src={process.env.PUBLIC_URL + '/bird.png'}
          alt="Flappy Bird Character"
          className="bird"
          style={{
            position: 'absolute',
            left: BIRD_LEFT_POSITION,
            transform: `translate3d(0, ${birdPosition}px, 0) rotate(${getBirdRotation()}deg)`,
            height: BIRD_HEIGHT,
            width: BIRD_WIDTH,
            zIndex: 5,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            imageRendering: 'crisp-edges',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
            transition: gameHasStarted ? 'none' : 'transform 0.3s ease'
          }}
          onError={() => setBirdImgError(true)}
        />
      ) : (
        <div
          className="bird-fallback"
          style={{
            position: 'absolute',
            left: BIRD_LEFT_POSITION,
            transform: `translate3d(0, ${birdPosition}px, 0) rotate(${getBirdRotation()}deg)`,
            height: BIRD_HEIGHT,
            width: BIRD_WIDTH,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            borderRadius: '50%',
            border: '2px solid #333',
            zIndex: 5,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            boxShadow: '2px 4px 6px rgba(0,0,0,0.3)',
            transition: gameHasStarted ? 'none' : 'transform 0.3s ease'
          }}
        />
      )}
      {/* Enhanced pipes with consistent image sizing */}
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          {/* Top Pipe */}
          {!pipeImgError ? (
            <img
              src={process.env.PUBLIC_URL + '/pipe-top.png'}
              alt="Top Pipe"
              className="topPipe-image"
              style={{
                position: 'absolute',
                left: pipe.left,
                height: pipe.topPipeHeight,
                top: 0,
                width: PIPE_WIDTH,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: 5,
                objectFit: 'fill',
                imageRendering: 'auto',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                background: 'transparent'
              }}
              onError={() => setPipeImgError(true)}
            />
          ) : (
            <div
              className="topPipe-fallback"
              style={{
                position: 'absolute',
                left: pipe.left,
                height: pipe.topPipeHeight,
                top: 0,
                width: PIPE_WIDTH,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: 4
              }}
            />
          )}

          {/* Bottom Pipe */}
          {!pipeImgError ? (
            <img
              src={process.env.PUBLIC_URL + '/pipe-bottom.png'}
              alt="Bottom Pipe"
              className="pipe-image"
              style={{
                position: 'absolute',
                left: pipe.left,
                height: pipe.bottomPipeHeight,
                bottom: 0,
                width: PIPE_WIDTH,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: 5,
                objectFit: 'fill',
                imageRendering: 'auto',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                background: 'transparent'
              }}
              onError={() => setPipeImgError(true)}
            />
          ) : (
            <div
              className="pipe-fallback"
              style={{
                position: 'absolute',
                left: pipe.left,
                height: pipe.bottomPipeHeight,
                bottom: 0,
                width: PIPE_WIDTH,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: 4
              }}
            />
          )}
        </React.Fragment>
      ))}
      {/* Enhanced game info with better styling */}
      <div
        className="game-info"
        style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          color: '#fff',
          fontSize: windowDimensions.width <= 480 ? '14px' : '18px',
          fontWeight: 'bold',
          zIndex: 10,
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        Score: {score} | Best: {highScore}
      </div>

      {/* Start menu with improved mobile support */}
      {!gameHasStarted && !gameOver && (
        <div className="menu">
          <h2 style={{
            fontSize: windowDimensions.width <= 480 ? '22px' : '28px',
            marginBottom: '15px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>
            Flappy Bird
          </h2>
          <p style={{
            fontSize: windowDimensions.width <= 480 ? '14px' : '16px',
            marginTop: '10px',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            {windowDimensions.width <= 768 ? 'Tap to fly!' : 'Tap, Click or Press Space to Play'}
          </p>
        </div>
      )}

      {/* Game over menu with enhanced styling */}
      {gameOver && (
        <div className="menu">
          <h2 style={{
            fontSize: windowDimensions.width <= 480 ? '24px' : '32px',
            marginBottom: '10px',
            color: '#ff4444',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}>
            Game Over
          </h2>
          <p style={{
            fontSize: windowDimensions.width <= 480 ? '14px' : '16px',
            marginBottom: '20px',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            Score: {score} {score > highScore && '🎉 New Record!'}
          </p>
          <button
            onClick={handleRestartButton}
            onTouchStart={handleRestartButton}
            onTouchEnd={(e) => e.preventDefault()}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer',
              padding: windowDimensions.width <= 480 ? '18px 36px' : '15px 30px',
              fontSize: windowDimensions.width <= 480 ? '20px' : '18px',
              minWidth: windowDimensions.width <= 480 ? '140px' : '120px',
              minHeight: windowDimensions.width <= 480 ? '56px' : '48px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              fontWeight: 'bold'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FlappyBirdGame;