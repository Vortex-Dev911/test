import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Trophy, RotateCcw, ChevronLeft, ChevronRight, User, Cpu } from 'lucide-react';

const ChessGame = ({ onWin }) => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState("White's Turn");
  const [gameOver, setGameOver] = useState(false);

  const makeAMove = useCallback((move) => {
    try {
      const result = game.move(move);
      setGame(new Chess(game.fen()));
      setMoveHistory(game.history());
      return result;
    } catch (e) {
      return null;
    }
  }, [game]);

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen for simplicity
    });

    if (move === null) return false;
    return true;
  };

  useEffect(() => {
    if (game.isGameOver()) {
      // Use a local flag or check state before setting to avoid cascading renders
      if (!gameOver) {
        setGameOver(true);
        if (game.isCheckmate()) {
          const winner = game.turn() === 'w' ? 'Black' : 'White';
          setStatus(`Checkmate! ${winner} Wins`);
          if (onWin) onWin(winner);
        } else if (game.isDraw()) {
          setStatus("Draw!");
        } else {
          setStatus("Game Over");
        }
      }
    } else {
      const turnStatus = game.turn() === 'w' ? "White's Turn" : "Black's Turn";
      if (status !== turnStatus) setStatus(turnStatus);
      
      // Basic Random Bot for Black
      if (game.turn() === 'b') {
        const timer = setTimeout(() => {
          const moves = game.moves();
          if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            makeAMove(randomMove);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [game, makeAMove, onWin, gameOver, status]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setGameOver(false);
    setStatus("White's Turn");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-6xl mx-auto animate-fadeInUp">
      {/* Sidebar - Stats & History */}
      <div className="space-y-8">
        <div className="card p-6 space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Trophy className="text-warning" /> Match Info
          </h3>
          <div className={`p-4 rounded-2xl text-center font-black text-xl border-2 transition-all
            ${game.turn() === 'w' ? 'bg-primary/10 border-primary text-primary' : 'bg-dark-input border-dark-border text-dark-muted'}`}>
            {status}
          </div>
          <button onClick={resetGame} className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <RotateCcw size={18} /> New Game
          </button>
        </div>

        <div className="card p-6 h-[400px] flex flex-col">
          <h4 className="text-lg font-black mb-4 uppercase tracking-widest text-dark-muted">Move History</h4>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {moveHistory.length === 0 ? (
              <p className="text-dark-muted italic text-center mt-10">No moves yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {moveHistory.map((move, i) => (
                  <div key={i} className={`p-2 rounded-lg text-sm font-bold flex items-center gap-2 ${i % 2 === 0 ? 'bg-dark-input' : 'bg-dark-card border border-dark-border'}`}>
                    <span className="text-dark-muted opacity-50 w-4">{Math.floor(i/2) + 1}.</span>
                    {move}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-dark-input rounded-xl flex items-center justify-center text-secondary">
              <Cpu size={24} />
            </div>
            <div>
              <p className="font-black">Stockfish (Lite)</p>
              <p className="text-xs text-dark-muted font-bold">Level 1 Bot</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="font-black">You</p>
              <p className="text-xs text-dark-muted font-bold">Grandmaster</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <User size={24} />
            </div>
          </div>
        </div>

        <div className="card p-4 bg-[#262421] border-dark-border shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop} 
            boardOrientation="white"
            customDarkSquareStyle={{ backgroundColor: '#779556' }}
            customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
          />
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/90 backdrop-blur-md animate-fadeIn">
          <div className="card p-12 text-center space-y-8 max-w-md w-full border-primary/30 shadow-primary/20">
            <Trophy size={80} className="text-warning mx-auto animate-bounce" />
            <h2 className="text-5xl font-black">{status}</h2>
            <div className="flex gap-4">
              <button onClick={resetGame} className="btn btn-primary flex-1">Play Again</button>
              <button onClick={() => window.history.back()} className="btn btn-secondary">Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
