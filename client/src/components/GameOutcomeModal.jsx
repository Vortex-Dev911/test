import React from 'react';
import { Trophy, RotateCcw, Home, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const GameOutcomeModal = ({ winner, onPlayAgain, onExit, mode = 'bot' }) => {
  const isWin = winner === 'player' || winner === 'White' || winner === 'Red' || winner === 'You';
  const isDraw = winner === 'Draw';

  React.useEffect(() => {
    // Play sound effects
    const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    const loseSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    
    if (isWin) {
      winSound.play().catch(e => console.log('Audio play blocked'));
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
      return () => clearInterval(interval);
    } else if (!isDraw) {
      loseSound.play().catch(e => console.log('Audio play blocked'));
    }
  }, [isWin, isDraw]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-bg/90 backdrop-blur-xl animate-fadeIn">
      <div className={`card max-w-md w-full p-12 text-center space-y-8 border-4 transform scale-110 shadow-2xl
        ${isWin ? 'border-success/50 shadow-success/20' : isDraw ? 'border-dark-muted/50' : 'border-error/50 shadow-error/20'}`}>
        
        <div className="relative">
          {isWin ? (
            <div className="animate-bounce">
              <Trophy size={100} className="text-warning mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
            </div>
          ) : (
            <div className="text-8xl mb-4">💀</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className={`text-6xl font-black uppercase tracking-tighter
            ${isWin ? 'text-success' : isDraw ? 'text-dark-muted' : 'text-error'}`}>
            {isWin ? 'Victory!' : isDraw ? "It's a Draw" : 'Defeat'}
          </h2>
          <p className="text-dark-muted font-bold text-xl">
            {isWin ? '+20 XP Earned' : isDraw ? '+5 XP Earned' : '-15 XP Penalty'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6">
          <button onClick={onPlayAgain} className="btn btn-primary py-5 text-xl flex items-center justify-center gap-3">
            <RotateCcw size={24} /> Play Again
          </button>
          <div className="flex gap-4">
            <button onClick={onExit} className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
              <Home size={20} /> Lobby
            </button>
            <button className="btn btn-secondary p-4">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOutcomeModal;
