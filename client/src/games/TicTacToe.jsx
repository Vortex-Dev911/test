import React, { useState, useEffect } from 'react';
import { RefreshCcw, User, Cpu, Trophy, Circle, X as XIcon } from 'lucide-react';

const TicTacToe = ({ mode = 'bot', onWin }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i] || (!isXNext && mode === 'bot')) return;

    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      if (onWin) onWin('player');
    } else if (newBoard.every(sq => sq)) {
      setWinner('Draw');
      if (onWin) onWin('draw');
    }
  };

  useEffect(() => {
    if (!isXNext && mode === 'bot' && !winner) {
      const timer = setTimeout(() => {
        const availableSquares = board.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
        if (availableSquares.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSquares.length);
          const move = availableSquares[randomIndex];
          const newBoard = board.slice();
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsXNext(true);

          const result = calculateWinner(newBoard);
          if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
            if (onWin) onWin('bot');
          } else if (newBoard.every(sq => sq)) {
            setWinner('Draw');
            if (onWin) onWin('draw');
          }
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, mode, onWin]);

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const resetGame = () => {
    resetRound();
    setScores({ player: 0, opponent: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto animate-fadeInUp">
      {/* Scoreboard */}
      <div className="w-full flex justify-between items-center gap-6">
        <div className={`flex-1 card p-6 text-center space-y-2 border-2 transition-all ${isXNext && !winner ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-transparent opacity-60'}`}>
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <User size={24} />
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">Player (X)</h4>
          <p className="text-4xl font-black">{scores.player}</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-black text-dark-muted px-4 py-2 bg-dark-input rounded-2xl border border-dark-border">VS</div>
          <button onClick={resetRound} className="p-4 bg-dark-input hover:bg-primary/20 hover:text-primary rounded-full transition-all hover:rotate-180">
            <RefreshCcw size={24} />
          </button>
        </div>

        <div className={`flex-1 card p-6 text-center space-y-2 border-2 transition-all ${!isXNext && !winner ? 'border-secondary shadow-lg shadow-secondary/20 scale-105' : 'border-transparent opacity-60'}`}>
          <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
            {mode === 'bot' ? <Cpu size={24} /> : <User size={24} />}
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">{mode === 'bot' ? 'Bot' : 'Opponent'} (O)</h4>
          <p className="text-4xl font-black">{scores.opponent}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-[40px] blur-3xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
        <div className="grid grid-cols-3 gap-6 p-6 bg-dark-card border border-dark-border rounded-[40px] shadow-2xl relative">
          {board.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={winner || sq || (!isXNext && mode === 'bot')}
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl text-6xl flex items-center justify-center transition-all duration-300
                ${sq === 'X' ? 'text-primary scale-110 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 
                  sq === 'O' ? 'text-secondary scale-110 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]' : 
                  'bg-dark-input/50 hover:bg-dark-input text-transparent hover:text-primary/20'}
                ${winningLine.includes(i) ? 'bg-primary/20 border-4 border-primary shadow-2xl scale-110 rotate-3 z-10' : 'border-2 border-dark-border'}
                active:scale-95 disabled:cursor-default
              `}
            >
              {sq === 'X' ? <XIcon size={64} strokeWidth={4} /> : 
               sq === 'O' ? <Circle size={56} strokeWidth={4} /> : 
               isXNext ? <XIcon size={40} strokeWidth={3} /> : <Circle size={36} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

      {/* Status & Controls */}
      <div className="w-full flex flex-col items-center gap-8">
        <div className={`px-12 py-6 rounded-[30px] text-3xl font-black transition-all shadow-2xl min-w-[320px] text-center
          ${winner === 'Draw' ? 'bg-dark-input text-dark-muted border border-dark-border' : 
            winner === 'X' ? 'bg-primary/20 text-primary border-2 border-primary' : 
            winner === 'O' ? 'bg-secondary/20 text-secondary border-2 border-secondary' : 
            'bg-dark-card text-dark-muted border border-dark-border'}
        `}>
          {winner === 'Draw' ? "IT'S A DRAW!" : 
           winner === 'X' ? "VICTORY! YOU WIN" : 
           winner === 'O' ? (mode === 'bot' ? "DEFEAT! BOT WINS" : "DEFEAT! OPPONENT WINS") : 
           (isXNext ? "YOUR TURN (X)" : (mode === 'bot' ? "BOT IS THINKING..." : "OPPONENT'S TURN (O)"))}
        </div>

        <div className="flex gap-6">
          <button onClick={resetRound} className="btn btn-primary px-10 py-4 text-xl flex items-center gap-3">
            <RefreshCcw size={20} /> New Round
          </button>
          <button onClick={resetGame} className="btn btn-secondary px-10 py-4 text-xl">
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
