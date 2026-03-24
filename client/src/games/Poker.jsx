import React, { useState } from 'react';
import { Trophy, RotateCcw, User, Cpu, Info, HandMetal, Play } from 'lucide-react';
import _ from 'lodash';

const Card = ({ suit, value, faceDown }) => {
  const suits = {
    hearts: { icon: '♥', color: 'text-error' },
    diamonds: { icon: '♦', color: 'text-error' },
    clubs: { icon: '♣', color: 'text-dark-text' },
    spades: { icon: '♠', color: 'text-dark-text' }
  };

  if (faceDown) {
    return (
      <div className="w-20 h-32 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
        <div className="text-primary opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform font-black">GAMEHUB</div>
      </div>
    );
  }

  return (
    <div className="w-20 h-32 bg-white border-2 border-dark-border rounded-xl flex flex-col justify-between p-2 shadow-xl hover:-translate-y-2 transition-transform">
      <div className={`text-xl font-black ${suits[suit].color} flex flex-col leading-none`}>
        {value}
        <span className="text-sm">{suits[suit].icon}</span>
      </div>
      <div className={`text-3xl self-center ${suits[suit].color}`}>{suits[suit].icon}</div>
      <div className={`text-xl font-black ${suits[suit].color} flex flex-col leading-none rotate-180`}>
        {value}
        <span className="text-sm">{suits[suit].icon}</span>
      </div>
    </div>
  );
};

const Poker = ({ onWin }) => {
  const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
  const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const [, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [gameState, setGameState] = useState('betting'); // betting, playing, result
  const [result, setResult] = useState(null);
  const [chips, setChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);

  const createDeck = () => {
    let newDeck = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        newDeck.push({ suit, value });
      });
    });
    return _.shuffle(newDeck);
  };

  const startNewRound = () => {
    const newDeck = createDeck();
    setPlayerHand([newDeck[0], newDeck[2]]);
    setBotHand([newDeck[1], newDeck[3]]);
    setDeck(newDeck.slice(4));
    setGameState('playing');
    setResult(null);
  };

  const handleBet = (amount) => {
    if (chips >= amount) {
      setChips(prev => prev - amount);
      setCurrentBet(prev => prev + amount);
      startNewRound();
    }
  };

  const getHandScore = (hand) => {
    const scores = { 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    return _.sumBy(hand, card => scores[card.value] || parseInt(card.value));
  };

  const determineWinner = () => {
    const pScore = getHandScore(playerHand);
    const bScore = getHandScore(botHand);
    
    setGameState('result');
    if (pScore > bScore) {
      setResult('You Win!');
      setChips(prev => prev + currentBet * 2);
      if (onWin) onWin('player');
    } else if (pScore < bScore) {
      setResult('Bot Wins!');
    } else {
      setResult('Split Pot!');
      setChips(prev => prev + currentBet);
    }
    setCurrentBet(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-fadeInUp">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-6 flex items-center justify-between border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-black">C</div>
            <p className="font-black">Your Chips</p>
          </div>
          <p className="text-3xl font-black text-primary">${chips}</p>
        </div>

        <div className="card p-6 flex items-center justify-between border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 text-secondary rounded-full flex items-center justify-center font-black">B</div>
            <p className="font-black">Current Bet</p>
          </div>
          <p className="text-3xl font-black text-secondary">${currentBet}</p>
        </div>

        <div className="card p-6 flex items-center justify-between border-dark-border">
          <button onClick={startNewRound} className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <RotateCcw size={18} /> New Round
          </button>
        </div>
      </div>

      <div className="card bg-emerald-900/40 border-emerald-500/30 p-12 min-h-[500px] flex flex-col justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        
        {/* Bot Area */}
        <div className="space-y-4 text-center">
          <div className="flex gap-4 justify-center">
            {botHand.map((card, i) => (
              <Card key={i} {...card} faceDown={gameState === 'playing'} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-dark-muted font-black uppercase tracking-widest text-xs">
            <Cpu size={14} /> Bot's Hand
          </div>
        </div>

        {/* Center Info */}
        <div className="text-center z-10">
          {gameState === 'betting' && (
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-white">Place Your Bet</h3>
              <div className="flex gap-4">
                {[50, 100, 200, 500].map(amt => (
                  <button key={amt} onClick={() => handleBet(amt)} className="btn btn-primary px-8">${amt}</button>
                ))}
              </div>
            </div>
          )}
          {gameState === 'result' && (
            <div className="space-y-4 animate-fadeInUp">
              <h2 className="text-6xl font-black text-white drop-shadow-lg">{result}</h2>
              <button onClick={() => setGameState('betting')} className="btn btn-primary px-12 py-4">Next Hand</button>
            </div>
          )}
        </div>

        {/* Player Area */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
            <User size={14} /> Your Hand
          </div>
          <div className="flex gap-4 justify-center">
            {playerHand.map((card, i) => (
              <Card key={i} {...card} />
            ))}
          </div>
          {gameState === 'playing' && (
            <button onClick={determineWinner} className="btn btn-primary px-12 py-4 text-xl mt-6 animate-pulse">SHOWDOWN</button>
          )}
        </div>
      </div>

      <div className="card p-8 border-dashed border-dark-border text-dark-muted text-sm font-bold flex gap-4 items-start">
        <Info size={24} className="text-primary flex-shrink-0" />
        <p>This is a simplified Poker engine. Every player gets two cards, and the highest total score wins. High-value cards like Aces and Face cards carry more points. Place your bets and beat the bot!</p>
      </div>
    </div>
  );
};

export default Poker;
