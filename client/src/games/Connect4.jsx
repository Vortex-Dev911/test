import React, { useState, useEffect } from 'react';
import { RotateCcw, User, Cpu, Circle, X as XIcon, HandMetal, Hand, Scissors } from 'lucide-react';

const Connect4 = ({ onWin }) => {
    const ROWS = 6;
    const COLS = 7;
    const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState({ red: 0, yellow: 0 });

    const checkWinner = (grid) => {
        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (grid[r][c] && grid[r][c] === grid[r][c+1] && grid[r][c] === grid[r][c+2] && grid[r][c] === grid[r][c+3]) return grid[r][c];
            }
        }
        // Vertical
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c] && grid[r][c] === grid[r+1][c] && grid[r][c] === grid[r+2][c] && grid[r][c] === grid[r+3][c]) return grid[r][c];
            }
        }
        // Diagonal Down
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (grid[r][c] && grid[r][c] === grid[r+1][c+1] && grid[r][c] === grid[r+2][c+2] && grid[r][c] === grid[r+3][c+3]) return grid[r][c];
            }
        }
        // Diagonal Up
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (grid[r][c] && grid[r][c] === grid[r-1][c+1] && grid[r][c] === grid[r-2][c+2] && grid[r][c] === grid[r-3][c+3]) return grid[r][c];
            }
        }
        return null;
    };

    const dropPiece = (col) => {
        if (winner) return;
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!newBoard[r][col]) {
                newBoard[r][col] = isRedNext ? 'Red' : 'Yellow';
                setBoard(newBoard);
                const winResult = checkWinner(newBoard);
                if (winResult) {
                    setWinner(winResult);
                    const winnerType = winResult === 'Red' ? 'player' : 'bot';
                    setScores(prev => ({ ...prev, [winResult.toLowerCase()]: prev[winResult.toLowerCase()] + 1 }));
                    if (onWin) onWin(winnerType);
                } else if (newBoard.every(row => row.every(cell => cell !== null))) {
                    setWinner('Draw');
                    if (onWin) onWin('draw');
                } else {
                    setIsRedNext(!isRedNext);
                }
                break;
            }
        }
    };

    useEffect(() => {
        if (!isRedNext && !winner) {
            const timer = setTimeout(() => {
                // Find available columns
                const availableCols = [];
                for (let c = 0; c < COLS; c++) {
                    if (!board[0][c]) availableCols.push(c);
                }
                
                if (availableCols.length > 0) {
                    const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
                    dropPiece(randomCol);
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isRedNext, winner, board]);

    const resetGame = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setWinner(null);
        setIsRedNext(true);
    };

    return (
        <div className="flex flex-col items-center gap-8 animate-fadeInUp">
            <div className="flex gap-12 w-full justify-between">
                <div className={`card p-4 flex-1 text-center border-2 ${isRedNext ? 'border-primary' : 'border-transparent'}`}>
                    <p className="text-xs font-black uppercase text-dark-muted">Red</p>
                    <p className="text-3xl font-black">{scores.red}</p>
                </div>
                <div className={`card p-4 flex-1 text-center border-2 ${!isRedNext ? 'border-warning' : 'border-transparent'}`}>
                    <p className="text-xs font-black uppercase text-dark-muted">Yellow</p>
                    <p className="text-3xl font-black">{scores.yellow}</p>
                </div>
            </div>

            <div className="bg-dark-card p-6 rounded-[2rem] border-8 border-dark-input shadow-2xl">
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: COLS }).map((_, c) => (
                        <button 
                            key={c} 
                            onClick={() => dropPiece(c)}
                            disabled={winner}
                            className="w-12 h-12 bg-dark-input rounded-full hover:bg-primary/20 transition-colors flex items-center justify-center text-primary"
                        >
                            ↓
                        </button>
                    ))}
                    {board.map((row, r) => (
                        row.map((cell, c) => (
                            <div key={`${r}-${c}`} className={`w-12 h-12 rounded-full shadow-inner ${cell === 'Red' ? 'bg-primary' : cell === 'Yellow' ? 'bg-warning' : 'bg-dark-bg'}`} />
                        ))
                    ))}
                </div>
            </div>

            {winner && (
                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black text-primary uppercase tracking-widest">{winner} Wins!</h3>
                    <button onClick={resetGame} className="btn btn-primary flex items-center gap-2">
                        <RotateCcw size={20} /> Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default Connect4;
