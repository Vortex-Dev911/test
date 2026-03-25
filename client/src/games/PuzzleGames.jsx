import React, { useState, useEffect, useCallback } from 'react';

export const Memory = ({ onWin }) => {
  const ICONS = ['🎮', '🕹️', '🎲', '🧩', '🎯', '♟️', '🏓', '🎱'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  const init = useCallback(() => {
    const paired = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
    setCards(paired.map((icon, id) => ({ id, icon })));
    setFlipped([]); setSolved([]); setMoves(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      init();
    }, 0);
    return () => clearTimeout(timer);
  }, []); // Run once on mount safely

  const click = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id)) return;
    const nf = [...flipped, id]; setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1);
      if (cards[nf[0]].icon === cards[nf[1]].icon) {
        const ns = [...solved, nf[0], nf[1]]; setSolved(ns); setFlipped([]);
        if (ns.length === cards.length) onWin(moves < 20 ? 'player' : 'bot');
      } else setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex gap-12 text-2xl font-black"><span className="text-primary">Moves: {moves}</span></div>
      <div className="grid grid-cols-4 gap-6">
        {cards.map(c => (
          <button key={c.id} onClick={() => click(c.id)} className={`w-24 h-24 rounded-2xl text-4xl flex items-center justify-center transition-all ${flipped.includes(c.id) || solved.includes(c.id) ? 'bg-primary text-white' : 'bg-dark-input hover:bg-dark-border'}`}>
            {(flipped.includes(c.id) || solved.includes(c.id)) ? c.icon : '?'}
          </button>
        ))}
      </div>
      {solved.length === cards.length && <button onClick={init} className="btn btn-primary px-10">Play Again</button>}
    </div>
  );
};

export const Trivia = ({ onWin }) => {
  const Q = [{q:"Capital of France?", o:["Paris","London","Berlin","Madrid"], a:0}, {q:"Red Planet?", o:["Earth","Mars","Jupiter","Venus"], a:1}, {q:"Romeo & Juliet author?", o:["Dickens","Shakespeare","Twain","Tolstoy"], a:1}];
  const [cur, setCur] = useState(0), [score, setScore] = useState(0), [sel, setSel] = useState(null), [done, setDone] = useState(false);

  const ans = (i) => {
    setSel(i); let ns = score; if (i === Q[cur].a) { ns = score + 1; setScore(ns); }
    setTimeout(() => {
      if (cur + 1 < Q.length) { setCur(cur + 1); setSel(null); }
      else { setDone(true); onWin(ns >= 2 ? 'player' : 'bot'); }
    }, 1000);
  };

  if (done) return <div className="card p-12 text-center space-y-8"><h2 className="text-4xl font-black">FINISHED</h2><div className="text-6xl text-primary">{score}/{Q.length}</div><button onClick={()=>{setCur(0);setScore(0);setSel(null);setDone(false);}} className="btn btn-primary">Try Again</button></div>;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="card p-10 bg-dark-input border-2 border-dark-border text-2xl font-black text-center">{Q[cur].q}</div>
      <div className="grid grid-cols-2 gap-6">
        {Q[cur].o.map((o, i) => (
          <button key={i} onClick={() => ans(i)} disabled={sel!==null} className={`btn p-6 text-lg border-2 ${sel===null?'btn-secondary hover:border-primary':i===Q[cur].a?'bg-success text-white':sel===i?'bg-error text-white':'opacity-30'}`}>{o}</button>
        ))}
      </div>
    </div>
  );
};

export const Sudoku = ({ onWin }) => {
  const INITIAL_BOARD = [[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]];
  const SOLUTION = [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
  
  const [grid, setGrid] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(0);

  const handleInput = useCallback((num) => {
    if (!selected) return;
    const [r, c] = selected;
    if (INITIAL_BOARD[r][c] !== 0) return;

    if (num !== 0 && num !== SOLUTION[r][c]) {
      setErrors(prev => prev + 1);
      return;
    }

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Check Win
    if (newGrid.every((row, ri) => row.every((cell, ci) => cell === SOLUTION[ri][ci]))) {
      onWin('player');
    }
  }, [selected, grid, onWin]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key));
      if (e.key === 'Backspace' || e.key === '0') handleInput(0);
      if (e.key === 'ArrowUp' && selected) setSelected(([r, c]) => [Math.max(0, r - 1), c]);
      if (e.key === 'ArrowDown' && selected) setSelected(([r, c]) => [Math.min(8, r + 1), c]);
      if (e.key === 'ArrowLeft' && selected) setSelected(([r, c]) => [r, Math.max(0, c - 1)]);
      if (e.key === 'ArrowRight' && selected) setSelected(([r, c]) => [r, Math.min(8, c + 1)]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, handleInput]);

  return (
    <div className="flex flex-col items-center gap-12 animate-fadeInUp">
      <div className="flex gap-12 text-2xl font-black">
        <span className="text-error">Errors: {errors}</span>
      </div>
      <div className="grid grid-cols-9 border-4 border-dark-border bg-dark-input rounded-xl overflow-hidden shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <button 
            key={`${r}-${c}`} 
            onClick={() => setSelected([r, c])}
            className={`w-10 h-10 border border-dark-border/30 flex items-center justify-center text-xl font-black transition-all
              ${INITIAL_BOARD[r][c] !== 0 ? 'bg-dark-input text-dark-muted cursor-default' : 'bg-dark-card text-primary hover:bg-primary/10'}
              ${selected && selected[0] === r && selected[1] === c ? 'ring-4 ring-primary ring-inset bg-primary/5' : ''}
              ${(Math.floor(r/3) + Math.floor(c/3)) % 2 === 0 ? 'brightness-110' : ''}`}
          >
            {cell || ''}
          </button>
        )))}
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
            <button 
              key={n} 
              onClick={() => handleInput(n)} 
              className="w-12 h-12 rounded-xl bg-dark-input border-2 border-dark-border text-primary font-black hover:border-primary hover:scale-110 transition-all active:scale-95"
            >
              {n === 0 ? '⌫' : n}
            </button>
          ))}
        </div>
        <button 
          onClick={() => { setGrid(INITIAL_BOARD); setErrors(0); setSelected(null); }}
          className="btn btn-secondary px-8 flex items-center gap-2"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
};
