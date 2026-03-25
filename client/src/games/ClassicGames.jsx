import React, { useState, useEffect } from 'react';
import { RotateCcw, User, Cpu, Circle, X as XIcon, HandMetal, Hand, Scissors, RefreshCcw } from 'lucide-react';

// Common Game Layout Wrapper
const GameWrapper = ({ children, title, score1, score2, label1 = "Player", label2 = "Opponent", turn, status, onReset, isXNext }) => (
  <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto animate-fadeInUp">
    <div className="w-full flex justify-between items-center gap-6">
      <div className={`flex-1 card p-6 text-center space-y-2 border-2 transition-all ${turn === 1 ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-transparent opacity-60'}`}>
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-2"><User size={24} /></div>
        <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">{label1}</h4>
        <p className="text-4xl font-black">{score1}</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="text-3xl font-black text-dark-muted px-4 py-2 bg-dark-input rounded-2xl border border-dark-border">VS</div>
        {onReset && (
          <button onClick={onReset} className="p-4 bg-dark-input hover:bg-primary/20 hover:text-primary rounded-full transition-all hover:rotate-180"><RefreshCcw size={24} /></button>
        )}
      </div>
      <div className={`flex-1 card p-6 text-center space-y-2 border-2 transition-all ${turn === 2 ? 'border-secondary shadow-lg shadow-secondary/20 scale-105' : 'border-transparent opacity-60'}`}>
        <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center mx-auto mb-2"><Cpu size={24} /></div>
        <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">{label2}</h4>
        <p className="text-4xl font-black">{score2}</p>
      </div>
    </div>
    {children}
    <div className={`px-12 py-6 rounded-[30px] text-3xl font-black transition-all shadow-2xl min-w-[320px] text-center bg-dark-card border border-dark-border`}>
      {status}
    </div>
  </div>
);

export const TicTacToe = ({ onWin }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });

  const checkWinner = (sq) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a,b,c] of lines) if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
    return sq.every(s => s) ? 'Draw' : null;
  };

  const handleClick = (i) => {
    if (winner || board[i] || !isXNext) return;
    const newBoard = [...board]; newBoard[i] = 'X'; setBoard(newBoard); setIsXNext(false);
    const res = checkWinner(newBoard);
    if (res) {
      setWinner(res); if (res === 'X') { setScores(s => ({...s, player: s.player+1})); onWin('player'); }
      else if (res === 'Draw') onWin('draw');
    }
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      setTimeout(() => {
        const avail = board.map((s,i) => s===null?i:null).filter(i=>i!==null);
        if (avail.length) {
          const newBoard = [...board]; newBoard[avail[Math.floor(Math.random()*avail.length)]] = 'O';
          setBoard(newBoard); setIsXNext(true);
          const res = checkWinner(newBoard);
          if (res) {
            setWinner(res); if (res === 'O') { setScores(s => ({...s, bot: s.bot+1})); onWin('bot'); }
            else if (res === 'Draw') onWin('draw');
          }
        }
      }, 600);
    }
  }, [isXNext, winner, board, onWin]);

  return (
    <GameWrapper turn={isXNext?1:2} score1={scores.player} score2={scores.bot} label2="Bot" status={winner ? (winner==='Draw'?"DRAW!":`${winner} WINS!`) : (isXNext?"YOUR TURN":"BOT THINKING...")} onReset={() => {setBoard(Array(9).fill(null)); setWinner(null); setIsXNext(true);}}>
      <div className="grid grid-cols-3 gap-6 p-6 bg-dark-card border border-dark-border rounded-[40px] shadow-2xl">
        {board.map((sq, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-28 h-28 rounded-3xl text-6xl flex items-center justify-center bg-dark-input hover:bg-dark-border transition-all border-2 border-dark-border">
            {sq === 'X' ? <XIcon className="text-primary" size={48} /> : sq === 'O' ? <Circle className="text-secondary" size={40} /> : null}
          </button>
        ))}
      </div>
    </GameWrapper>
  );
};

export const Connect4 = ({ onWin }) => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [isRedNext, setIsRedNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });

  const checkWinner = (g) => {
    for (let r=0; r<6; r++) for (let c=0; c<4; c++) if (g[r][c] && g[r][c]===g[r][c+1] && g[r][c]===g[r][c+2] && g[r][c]===g[r][c+3]) return g[r][c];
    for (let r=0; r<3; r++) for (let c=0; c<7; c++) if (g[r][c] && g[r][c]===g[r+1][c] && g[r][c]===g[r+2][c] && g[r][c]===g[r+3][c]) return g[r][c];
    for (let r=0; r<3; r++) for (let c=0; c<4; c++) if (g[r][c] && g[r][c]===g[r+1][c+1] && g[r][c]===g[r+2][c+2] && g[r][c]===g[r+3][c+3]) return g[r][c];
    for (let r=3; r<6; r++) for (let c=0; c<4; c++) if (g[r][c] && g[r][c]===g[r-1][c+1] && g[r][c]===g[r-2][c+2] && g[r][c]===g[r-3][c+3]) return g[r][c];
    return g.every(r => r.every(c => c)) ? 'Draw' : null;
  };

  const drop = (c) => {
    if (winner || !isRedNext) return;
    const nb = board.map(r => [...r]);
    for (let r=5; r>=0; r--) {
      if (!nb[r][c]) {
        nb[r][c] = 'Red'; setBoard(nb); setIsRedNext(false);
        const res = checkWinner(nb);
        if (res) { setWinner(res); if (res==='Red') {setScores(s=>({...s, player: s.player+1})); onWin('player');} else if (res==='Draw') onWin('draw'); }
        break;
      }
    }
  };

  useEffect(() => {
    if (!isRedNext && !winner) {
      setTimeout(() => {
        const avail = []; for (let c=0; c<7; c++) if (!board[0][c]) avail.push(c);
        if (avail.length) {
          const c = avail[Math.floor(Math.random()*avail.length)];
          const nb = board.map(r => [...r]);
          for (let r=5; r>=0; r--) if (!nb[r][c]) {
            nb[r][c] = 'Yellow'; setBoard(nb); setIsRedNext(true);
            const res = checkWinner(nb);
            if (res) { setWinner(res); if (res==='Yellow') {setScores(s=>({...s, bot: s.bot+1})); onWin('bot');} else if (res==='Draw') onWin('draw'); }
            break;
          }
        }
      }, 800);
    }
  }, [isRedNext, winner, board, onWin]);

  return (
    <GameWrapper turn={isRedNext?1:2} score1={scores.player} score2={scores.bot} label2="Bot" status={winner ? (winner==='Draw'?"DRAW!":`${winner} WINS!`) : (isRedNext?"YOUR TURN":"BOT THINKING...")} onReset={() => {setBoard(Array(6).fill(null).map(() => Array(7).fill(null))); setWinner(null); setIsRedNext(true);}}>
      <div className="bg-dark-card p-6 rounded-[2rem] border-8 border-dark-input shadow-2xl grid grid-cols-7 gap-4">
        {Array.from({length:7}).map((_,c)=><button key={c} onClick={()=>drop(c)} className="w-12 h-12 bg-dark-input rounded-full hover:bg-primary/20 text-primary">↓</button>)}
        {board.map(r => r.map((cell, i) => <div key={i} className={`w-12 h-12 rounded-full ${cell==='Red'?'bg-primary':cell==='Yellow'?'bg-warning':'bg-dark-bg'}`} />))}
      </div>
    </GameWrapper>
  );
};

export const RockPaperScissors = ({ onWin }) => {
  const [scores, setScores] = useState({ player: 0, bot: 0 });
  const [result, setResult] = useState(null);
  const choices = [{id:'rock', icon:<HandMetal size={48}/>, beats:'scissors'}, {id:'paper', icon:<Hand size={48}/>, beats:'rock'}, {id:'scissors', icon:<Scissors size={48}/>, beats:'paper'}];

  const play = (id) => {
    const bot = choices[Math.floor(Math.random()*3)];
    const player = choices.find(c => c.id === id);
    let res = player.id === bot.id ? 'Draw' : (player.beats === bot.id ? 'Player' : 'Bot');
    setResult({player, bot, res});
    if (res === 'Player') { setScores(s=>({...s, player: s.player+1})); onWin('player'); }
    else if (res === 'Bot') { setScores(s=>({...s, bot: s.bot+1})); onWin('bot'); }
    else onWin('draw');
  };

  return (
    <GameWrapper score1={scores.player} score2={scores.bot} label2="Bot" status={result ? (result.res==='Draw'?"DRAW!":`${result.res} WINS!`) : "CHOOSE YOUR WEAPON"} onReset={() => setResult(null)}>
      <div className="flex gap-8">
        {choices.map(c => (
          <button key={c.id} onClick={() => play(c.id)} className="w-28 h-28 bg-dark-card border-2 border-dark-border rounded-3xl flex flex-col items-center justify-center hover:border-primary transition-all text-primary">
            {c.icon} <span className="text-xs font-black uppercase mt-2">{c.id}</span>
          </button>
        ))}
      </div>
    </GameWrapper>
  );
};
