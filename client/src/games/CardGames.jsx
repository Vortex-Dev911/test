import React, { useState, useCallback } from 'react';
import { Cpu, User, RotateCcw, Info } from 'lucide-react';
import _ from 'lodash';

const Card = ({ suit, value, faceDown }) => {
  const suits = { hearts: { i: '♥', c: 'text-error' }, diamonds: { i: '♦', c: 'text-error' }, clubs: { i: '♣', c: 'text-dark-text' }, spades: { i: '♠', c: 'text-dark-text' } };
  if (faceDown) return <div className="w-20 h-32 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center shadow-lg font-black text-primary opacity-20">GAMEHUB</div>;
  return (
    <div className="w-20 h-32 bg-white border-2 border-dark-border rounded-xl flex flex-col justify-between p-2 shadow-xl">
      <div className={`text-xl font-black ${suits[suit].c} flex flex-col leading-none`}>{value}<span className="text-sm">{suits[suit].i}</span></div>
      <div className={`text-3xl self-center ${suits[suit].c}`}>{suits[suit].i}</div>
      <div className={`text-xl font-black ${suits[suit].c} flex flex-col leading-none rotate-180`}>{value}<span className="text-sm">{suits[suit].i}</span></div>
    </div>
  );
};

export const Poker = ({ onWin }) => {
  const [playerHand, setPlayerHand] = useState([]), [botHand, setBotHand] = useState([]), [state, setState] = useState('betting'), [res, setRes] = useState(null), [chips, setChips] = useState(1000), [bet, setBet] = useState(0);

  const start = useCallback((amt) => {
    if (chips < amt) return; setChips(c => c - amt); setBet(amt);
    const d = _.shuffle(_.flatMap(['hearts','diamonds','clubs','spades'], s => ['2','3','4','5','6','7','8','9','10','J','Q','K','A'].map(v => ({s,v}))));
    setPlayerHand([d[0], d[2]]); setBotHand([d[1], d[3]]); setState('playing'); setRes(null);
  }, [chips]);

  const score = (h) => _.sumBy(h, c => ({'J':11,'Q':12,'K':13,'A':14}[c.v] || parseInt(c.v)));

  const showdown = () => {
    const ps = score(playerHand), bs = score(botHand); setState('result');
    if (ps > bs) { setRes('You Win!'); setChips(c => c + bet*2); onWin('player'); }
    else if (ps < bs) { setRes('Bot Wins!'); onWin('bot'); }
    else { setRes('Split!'); setChips(c => c + bet); onWin('draw'); }
    setBet(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="grid grid-cols-2 gap-8">
        <div className="card p-6 flex justify-between border-primary/20"><p className="font-black">Chips</p><p className="text-3xl font-black text-primary">${chips}</p></div>
        <div className="card p-6 flex justify-between border-secondary/20"><p className="font-black">Bet</p><p className="text-3xl font-black text-secondary">${bet}</p></div>
      </div>
      <div className="card bg-emerald-900/40 border-emerald-500/30 p-12 min-h-[500px] flex flex-col justify-between items-center relative">
        <div className="flex gap-4">{botHand.map((c, i) => <Card key={i} suit={c.s} value={c.v} faceDown={state==='playing'} />)}</div>
        <div className="text-center z-10">
          {state==='betting' && <div className="flex gap-4">{[50,100,200,500].map(a => <button key={a} onClick={()=>start(a)} className="btn btn-primary px-8">${a}</button>)}</div>}
          {state==='result' && <div className="space-y-4"><h2 className="text-6xl font-black text-white">{res}</h2><button onClick={()=>setState('betting')} className="btn btn-primary px-12 py-4">Next Hand</button></div>}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">{playerHand.map((c, i) => <Card key={i} suit={c.s} value={c.v} />)}</div>
          {state==='playing' && <button onClick={showdown} className="btn btn-primary px-12 py-4 text-xl">SHOWDOWN</button>}
        </div>
      </div>
    </div>
  );
};
