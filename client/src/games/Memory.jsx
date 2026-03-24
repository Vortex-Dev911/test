import React, { useState, useEffect } from 'react';

const Memory = ({ onWin }) => {
  const ICONS = ['🎮', '🕹️', '🎲', '🧩', '🎯', '♟️', '🏓', '🎱'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = [];
    const pairedIcons = [...ICONS, ...ICONS];
    // Shuffle
    for (let i = pairedIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedIcons[i], pairedIcons[j]] = [pairedIcons[j], pairedIcons[i]];
    }
    
    pairedIcons.forEach((icon, index) => {
      deck.push({ id: index, icon });
    });

    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id) || gameOver) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const first = newFlipped[0];
      const second = newFlipped[1];
      
      if (cards[first].icon === cards[second].icon) {
        const newSolved = [...solved, first, second];
        setSolved(newSolved);
        setFlipped([]);
        
        if (newSolved.length === cards.length) {
          setGameOver(true);
          if (onWin) onWin(moves < 20 ? 'player' : 'bot'); // "Win" if under 20 moves
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex gap-12 text-2xl font-black">
        <span className="text-primary">Moves: {moves}</span>
        <span className="text-secondary">Pairs: {solved.length / 2} / {ICONS.length}</span>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-24 h-24 rounded-2xl text-4xl flex items-center justify-center transition-all duration-500 transform
              ${flipped.includes(card.id) || solved.includes(card.id) 
                ? 'bg-primary text-white rotate-y-180' 
                : 'bg-dark-input text-transparent hover:bg-dark-border'}`}
          >
            {(flipped.includes(card.id) || solved.includes(card.id)) ? card.icon : '?'}
          </button>
        ))}
      </div>

      {solved.length === cards.length && (
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-black text-success">WELL DONE!</h2>
          <button onClick={initializeGame} className="btn btn-primary px-10">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Memory;
