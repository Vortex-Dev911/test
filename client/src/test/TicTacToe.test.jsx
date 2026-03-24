import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicTacToe from '../games/TicTacToe';

describe('TicTacToe Engine', () => {
  it('renders the board', () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole('button');
    // 9 cells + 2 buttons (New Round, Reset Scores) + 1 VS button/label
    expect(cells.length).toBeGreaterThanOrEqual(9);
  });

  it('updates cell on click', () => {
    render(<TicTacToe mode="manual" />); // Set to manual to test without bot
    const cells = screen.getAllByRole('button');
    fireEvent.click(cells[0]);
    // Check if X icon or text is present
    expect(cells[0]).not.toBeEmptyDOMElement();
  });

  it('detects a winner', () => {
    const onWin = vi.fn();
    render(<TicTacToe mode="manual" onWin={onWin} />);
    const cells = screen.getAllByRole('button');
    
    // Simulating X winning on top row
    fireEvent.click(cells[0]); // X
    fireEvent.click(cells[3]); // O (bot move simulation or manual)
    fireEvent.click(cells[1]); // X
    fireEvent.click(cells[4]); // O
    fireEvent.click(cells[2]); // X
    
    expect(screen.getByText(/VICTORY/i)).toBeInTheDocument();
  });
});
