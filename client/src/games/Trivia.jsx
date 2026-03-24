import React, { useState, useEffect } from 'react';

const Trivia = ({ onWin }) => {
  const QUESTIONS = [
    { q: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], a: 0 },
    { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], a: 1 },
    { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"], a: 1 },
    { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], a: 3 },
    { q: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], a: 0 },
    { q: "Which country is home to the Great Barrier Reef?", options: ["Australia", "Brazil", "South Africa", "Thailand"], a: 0 },
    { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], a: 2 },
    { q: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], a: 1 },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAnswer = (index) => {
    setSelected(index);
    let newScore = score;
    if (index === QUESTIONS[current].a) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {
      const next = current + 1;
      if (next < QUESTIONS.length) {
        setCurrent(next);
        setSelected(null);
      } else {
        setShowScore(true);
        if (onWin) {
          if (newScore >= 6) onWin('player');
          else if (newScore >= 3) onWin('draw');
          else onWin('bot');
        }
      }
    }, 1000);
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setShowScore(false);
    setSelected(null);
  };

  if (showScore) {
    return (
      <div className="card p-12 text-center space-y-8 animate-fadeInUp">
        <h2 className="text-4xl font-black">QUIZ FINISHED</h2>
        <div className="text-6xl font-black text-primary">{score} / {QUESTIONS.length}</div>
        <p className="text-dark-muted font-bold">Great effort! Can you beat your high score?</p>
        <button onClick={reset} className="btn btn-primary px-10">Try Again</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeInUp">
      <div className="flex justify-between items-center text-dark-muted font-black text-xs uppercase tracking-widest">
        <span>Question {current + 1} of {QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="card p-10 bg-dark-input border-2 border-dark-border">
        <h3 className="text-2xl font-black text-center">{QUESTIONS[current].q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUESTIONS[current].options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
            className={`btn p-6 text-lg border-2 transition-all
              ${selected === null ? 'btn-secondary border-dark-border hover:border-primary' : 
                i === QUESTIONS[current].a ? 'bg-success text-white border-success' : 
                selected === i ? 'bg-error text-white border-error' : 'opacity-30'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Trivia;
