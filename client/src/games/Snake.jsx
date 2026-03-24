import React, { useState, useEffect, useRef, useCallback } from 'react';

const Snake = ({ onWin }) => {
  const CANVAS_SIZE = 400;
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [[10, 10], [10, 11], [10, 12]];
  const INITIAL_FOOD = [5, 5];
  const INITIAL_DIRECTION = [0, -1];
  const SPEED = 150;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

    // Wall collision
    if (head[0] < 0 || head[0] >= CANVAS_SIZE / GRID_SIZE || head[1] < 0 || head[1] >= CANVAS_SIZE / GRID_SIZE) {
      setGameOver(true);
      return;
    }

    // Self collision
    if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Food collision
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(s => s + 10);
      setFood([
        Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
        case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
        case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
        case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw Snake
    ctx.fillStyle = '#818cf8';
    snake.forEach(([x, y]) => ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2));

    // Draw Food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
  }, [snake, food]);

  const reset = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="card p-4 bg-dark-input text-primary font-black text-2xl">Score: {score}</div>
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="border-4 border-dark-border rounded-2xl bg-dark-bg shadow-2xl" />
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm rounded-[2.5rem] z-10 space-y-6">
          <h2 className="text-5xl font-black text-error">GAME OVER</h2>
          <button onClick={reset} className="btn btn-primary px-10">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Snake;
