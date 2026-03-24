import React, { useState, useEffect, useRef, useCallback } from 'react';

const Pong = () => {
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 10;
  const BALL_SPEED = 5;

  const [paddle1Y, setPaddle1Y] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [paddle2Y, setPaddle2Y] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED });
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const canvasRef = useRef(null);

  const resetBall = (direction) => {
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: BALL_SPEED * direction, dy: BALL_SPEED });
  };

  const moveBall = useCallback(() => {
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Wall collision
    if (newBall.y <= 0 || newBall.y + BALL_SIZE >= CANVAS_HEIGHT) newBall.dy *= -1;

    // Paddle 1 collision
    if (newBall.x <= PADDLE_WIDTH && newBall.y + BALL_SIZE >= paddle1Y && newBall.y <= paddle1Y + PADDLE_HEIGHT) {
      newBall.dx *= -1.1; // Speed up
    }

    // Paddle 2 collision
    if (newBall.x + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH && newBall.y + BALL_SIZE >= paddle2Y && newBall.y <= paddle2Y + PADDLE_HEIGHT) {
      newBall.dx *= -1.1; // Speed up
    }

    // Scoring
    if (newBall.x < 0) {
      setScores(s => ({ ...s, p2: s.p2 + 1 }));
      resetBall(1);
      return;
    }
    if (newBall.x > CANVAS_WIDTH) {
      setScores(s => ({ ...s, p1: s.p1 + 1 }));
      resetBall(-1);
      return;
    }

    // Simple AI for paddle 2
    setPaddle2Y(prev => {
        const targetY = newBall.y - PADDLE_HEIGHT / 2;
        const diff = targetY - prev;
        return Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + diff * 0.1));
    });

    setBall(newBall);
  }, [ball, paddle1Y, paddle2Y]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') setPaddle1Y(p => Math.max(0, p - PADDLE_SPEED * 2));
      if (e.key === 'ArrowDown') setPaddle1Y(p => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, p + PADDLE_SPEED * 2));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveBall, 30);
    return () => clearInterval(interval);
  }, [moveBall]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
  }, [ball, paddle1Y, paddle2Y]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-12 text-5xl font-black">
        <span className="text-primary">{scores.p1}</span>
        <span className="text-dark-muted">:</span>
        <span className="text-secondary">{scores.p2}</span>
      </div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-4 border-dark-border rounded-2xl bg-dark-bg shadow-2xl" />
    </div>
  );
};

export default Pong;
