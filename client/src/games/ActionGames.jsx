import React, { useState, useEffect, useRef, useCallback } from 'react';

export const Snake = ({ onWin }) => {
  const CANVAS_SIZE = 400, GRID_SIZE = 20, SPEED = 150;
  const [snake, setSnake] = useState([[10, 10], [10, 11], [10, 12]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  const move = useCallback(() => {
    if (gameOver) return;
    const ns = [...snake];
    const head = [ns[0][0] + direction[0], ns[0][1] + direction[1]];
    if (head[0]<0 || head[0]>=CANVAS_SIZE/GRID_SIZE || head[1]<0 || head[1]>=CANVAS_SIZE/GRID_SIZE || ns.some(s => s[0]===head[0] && s[1]===head[1])) {
      setGameOver(true); onWin(score > 50 ? 'player' : 'bot'); return;
    }
    ns.unshift(head);
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(s => s + 10); setFood([Math.floor(Math.random()*20), Math.floor(Math.random()*20)]);
    } else ns.pop();
    setSnake(ns);
  }, [snake, direction, food, gameOver, score, onWin]);

  useEffect(() => {
    const h = (e) => {
      if (e.key==='ArrowUp' && direction[1]!==1) setDirection([0,-1]);
      else if (e.key==='ArrowDown' && direction[1]!==-1) setDirection([0,1]);
      else if (e.key==='ArrowLeft' && direction[0]!==1) setDirection([-1,0]);
      else if (e.key==='ArrowRight' && direction[0]!==-1) setDirection([1,0]);
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [direction]);

  useEffect(() => { const i = setInterval(move, SPEED); return () => clearInterval(i); }, [move]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 400, 400); ctx.fillStyle = '#818cf8';
    snake.forEach(([x, y]) => ctx.fillRect(x*20, y*20, 18, 18));
    ctx.fillStyle = '#ef4444'; ctx.fillRect(food[0]*20, food[1]*20, 18, 18);
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      <div className="card p-4 bg-dark-input text-primary font-black text-2xl">Score: {score}</div>
      <canvas ref={canvasRef} width={400} height={400} className="border-4 border-dark-border rounded-2xl bg-dark-bg" />
      {gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm z-10"><h2 className="text-5xl font-black text-error">GAME OVER</h2><button onClick={()=>{setSnake([[10,10],[10,11],[10,12]]);setGameOver(false);setScore(0);setDirection([0,-1]);}} className="btn btn-primary mt-4">Try Again</button></div>}
    </div>
  );
};

export const Pong = ({ onWin }) => {
  const [p1Y, setP1Y] = useState(160), [p2Y, setP2Y] = useState(160);
  const [ball, setBall] = useState({x:300, y:200, dx:5, dy:5});
  const [scores, setScores] = useState({p1:0, p2:0}), [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  const move = useCallback(() => {
    if (gameOver) return;
    let nb = {...ball}; nb.x += nb.dx; nb.y += nb.dy;
    if (nb.y<=0 || nb.y>=390) nb.dy *= -1;
    if (nb.x<=10 && nb.y+10>=p1Y && nb.y<=p1Y+80) nb.dx *= -1.1;
    if (nb.x>=580 && nb.y+10>=p2Y && nb.y<=p2Y+80) nb.dx *= -1.1;
    if (nb.x<0) { 
      const s = scores.p2+1; setScores(prev=>({...prev, p2:s})); 
      if (s>=5) {setGameOver(true); onWin('bot');} else setBall({x:300,y:200,dx:5,dy:5}); 
    } else if (nb.x>600) {
      const s = scores.p1+1; setScores(prev=>({...prev, p1:s}));
      if (s>=5) {setGameOver(true); onWin('player');} else setBall({x:300,y:200,dx:-5,dy:5});
    } else {
      setP2Y(prev => prev + (nb.y - (prev+40)) * 0.15); setBall(nb);
    }
  }, [ball, p1Y, p2Y, scores, gameOver, onWin]);

  useEffect(() => {
    const h = (e) => { if (e.key==='ArrowUp') setP1Y(y=>Math.max(0,y-20)); if (e.key==='ArrowDown') setP1Y(y=>Math.min(320,y+20)); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => { const i = setInterval(move, 30); return () => clearInterval(i); }, [move]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0,0,600,400); ctx.fillStyle='#818cf8';
    ctx.fillRect(0,p1Y,10,80); ctx.fillRect(590,p2Y,10,80);
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 5, 0, Math.PI*2); ctx.fill();
  }, [ball, p1Y, p2Y]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      <div className="flex gap-12 text-5xl font-black"><span className="text-primary">{scores.p1}</span><span className="text-dark-muted">:</span><span className="text-secondary">{scores.p2}</span></div>
      <canvas ref={canvasRef} width={600} height={400} className="border-4 border-dark-border rounded-2xl bg-dark-bg" />
      {gameOver && <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm z-10"><h2 className="text-5xl font-black text-primary">GAME OVER</h2><button onClick={()=>{setScores({p1:0,p2:0});setGameOver(false);setBall({x:300,y:200,dx:5,dy:5});}} className="btn btn-primary mt-4">Play Again</button></div>}
    </div>
  );
};
