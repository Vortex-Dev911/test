import React, { useState } from 'react';
import { RefreshCcw, User, Cpu, Trophy, Hand, Scissors, HandMetal, RotateCcw } from 'lucide-react';

const RockPaperScissors = ({ onWin }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const choices = [
    { id: 'rock', name: 'Rock', icon: <HandMetal size={48} strokeWidth={3} />, beats: 'scissors' },
    { id: 'paper', name: 'Paper', icon: <Hand size={48} strokeWidth={3} />, beats: 'rock' },
    { id: 'scissors', name: 'Scissors', icon: <Scissors size={48} strokeWidth={3} />, beats: 'paper' }
  ];

  const determineWinner = (player, bot) => {
    if (player === bot) return 'Draw';
    const playerMove = choices.find(c => c.id === player);
    if (playerMove.beats === bot) return 'Player';
    return 'Opponent';
  };

  const handlePlay = (choiceId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choiceId);
    setBotChoice(null);
    setWinner(null);

    // Animation delay for "suspense"
    setTimeout(() => {
      const randomChoice = choices[Math.floor(Math.random() * choices.length)].id;
      setBotChoice(randomChoice);
      
      const result = determineWinner(choiceId, randomChoice);
      setWinner(result);
      
      if (result === 'Player') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        if (onWin) onWin('player');
      } else if (result === 'Opponent') {
        setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
        if (onWin) onWin('opponent');
      }
      
      setIsAnimating(false);
    }, 1200);
  };

  const resetRound = () => {
    setPlayerChoice(null);
    setBotChoice(null);
    setWinner(null);
    setIsAnimating(false);
  };

  const resetGame = () => {
    resetRound();
    setScores({ player: 0, opponent: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto animate-fadeInUp">
      {/* Scoreboard */}
      <div className="w-full flex justify-between items-center gap-6">
        <div className="flex-1 card p-6 text-center space-y-2 border-2 border-primary/20 bg-primary/5">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <User size={24} />
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">Player</h4>
          <p className="text-4xl font-black">{scores.player}</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-black text-dark-muted px-4 py-2 bg-dark-input rounded-2xl border border-dark-border">VS</div>
        </div>

        <div className="flex-1 card p-6 text-center space-y-2 border-2 border-secondary/20 bg-secondary/5">
          <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
            <Cpu size={24} />
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-dark-muted">Bot</h4>
          <p className="text-4xl font-black">{scores.opponent}</p>
        </div>
      </div>

      {/* Game Display */}
      <div className="w-full flex justify-around items-center h-64 card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 -z-10"></div>
        
        <div className="text-center space-y-4 relative">
          <div className={`w-32 h-32 rounded-3xl bg-dark-input flex items-center justify-center text-primary transition-all duration-300 shadow-2xl
            ${isAnimating ? 'animate-bounce' : ''}
            ${winner === 'Player' ? 'scale-125 border-4 border-success bg-success/10 shadow-success/20' : 
              winner === 'Opponent' ? 'opacity-30' : ''}
          `}>
            {playerChoice ? choices.find(c => c.id === playerChoice).icon : <HandMetal size={48} className="opacity-20" />}
          </div>
          <p className="font-black text-sm uppercase tracking-widest text-primary">Your Move</p>
        </div>

        <div className="text-5xl font-black text-dark-muted opacity-20 italic select-none">BATTLE</div>

        <div className="text-center space-y-4 relative">
          <div className={`w-32 h-32 rounded-3xl bg-dark-input flex items-center justify-center text-secondary transition-all duration-300 shadow-2xl
            ${isAnimating ? 'animate-bounce delay-150' : ''}
            ${winner === 'Opponent' ? 'scale-125 border-4 border-success bg-success/10 shadow-success/20' : 
              winner === 'Player' ? 'opacity-30' : ''}
          `}>
            {botChoice ? choices.find(c => c.id === botChoice).icon : <Cpu size={48} className="opacity-20" />}
          </div>
          <p className="font-black text-sm uppercase tracking-widest text-secondary">Bot Move</p>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="w-full space-y-12 text-center">
        {!winner && !isAnimating ? (
          <div className="space-y-6">
            <p className="text-xl font-black text-dark-muted tracking-widest uppercase">Choose Your Weapon</p>
            <div className="flex justify-center gap-8">
              {choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handlePlay(choice.id)}
                  className="w-28 h-28 bg-dark-card border-2 border-dark-border rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:-translate-y-2 hover:bg-primary/5 hover:shadow-2xl transition-all group"
                >
                  <div className="group-hover:scale-110 transition-transform text-primary">
                    {choice.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-dark-muted group-hover:text-primary">{choice.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 flex flex-col items-center">
            <div className={`px-12 py-6 rounded-[30px] text-4xl font-black shadow-2xl min-w-[320px] transition-all
              ${winner === 'Draw' ? 'bg-dark-input text-dark-muted border border-dark-border scale-110' : 
                winner === 'Player' ? 'bg-success/20 text-success border-4 border-success scale-125 shadow-success/20' : 
                winner === 'Opponent' ? 'bg-error/20 text-error border-4 border-error scale-110' : 
                'bg-dark-card text-dark-muted animate-pulse'}
            `}>
              {isAnimating ? "READY..." : (winner === 'Draw' ? "IT'S A DRAW!" : winner === 'Player' ? "YOU WIN!" : "BOT WINS!")}
            </div>
            
            {!isAnimating && (
              <div className="flex gap-6">
                <button onClick={resetRound} className="btn btn-primary px-10 py-4 text-xl flex items-center gap-3">
                  <RotateCcw size={20} /> Next Battle
                </button>
                <button onClick={resetGame} className="btn btn-secondary px-10 py-4 text-xl">
                  Reset Scores
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RockPaperScissors;
