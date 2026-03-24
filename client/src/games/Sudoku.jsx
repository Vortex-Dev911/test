import React, { useState, useEffect, useCallback } from 'react';

const Sudoku = ({ onWin }) => {
  const INITIAL_BOARD = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  const [grid, setGrid] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(0);

  const handleCellClick = (r, c) => {
    if (INITIAL_BOARD[r][c] !== 0) return;
    setSelected([r, c]);
  };

  const handleNumberInput = useCallback((num) => {
    if (!selected) return;
    const [r, c] = selected;
    if (num !== 0 && num !== SOLUTION[r][c]) {
      setErrors(e => e + 1);
      return;
    }
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Check win
    if (newGrid.every((row, ri) => row.every((cell, ci) => cell === SOLUTION[ri][ci]))) {
      if (onWin) onWin('player');
    }
  }, [selected, grid, onWin]);

  useEffect(() => {
    const handleKey = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) handleNumberInput(num);
      if (e.key === 'Backspace') handleNumberInput(0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNumberInput]);

  const reset = () => {
    setGrid(INITIAL_BOARD);
    setSelected(null);
    setErrors(0);
  };

  return (
    <div className="flex flex-col items-center gap-12 animate-fadeInUp">
      <div className="flex gap-12 text-2xl font-black">
        <span className="text-error">Errors: {errors}</span>
      </div>
      <div className="grid grid-cols-9 border-4 border-dark-border bg-dark-input rounded-xl overflow-hidden shadow-2xl">
        {grid.map((row, r) => (
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`w-10 h-10 sm:w-12 sm:h-12 border border-dark-border/30 flex items-center justify-center text-xl font-black transition-all
                ${(r + 1) % 3 === 0 && r < 8 ? 'border-b-4' : ''}
                ${(c + 1) % 3 === 0 && c < 8 ? 'border-r-4' : ''}
                ${INITIAL_BOARD[r][c] !== 0 ? 'bg-dark-input text-dark-muted' : 'bg-dark-card text-primary hover:bg-primary/10'}
                ${selected && selected[0] === r && selected[1] === c ? 'bg-primary/20 ring-4 ring-primary ring-inset' : ''}`}
            >
              {cell !== 0 ? cell : ''}
            </button>
          ))
        ))}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
            <button
              key={n}
              onClick={() => handleNumberInput(n)}
              className="w-12 h-12 rounded-xl bg-dark-input border-2 border-dark-border text-primary font-black hover:border-primary transition-all"
            >
              {n === 0 ? '⌫' : n}
            </button>
          ))}
        </div>
        <button onClick={reset} className="btn btn-secondary px-10">Reset Board</button>
      </div>
    </div>
  );
};

export default Sudoku;
