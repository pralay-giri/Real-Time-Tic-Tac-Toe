import { GameStatus } from '../types';

const gameStatus = (board: Array<number>): GameStatus => {
    // Winning combinations
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns

        [0, 4, 8],
        [2, 4, 6], // Diagonals
    ];

    // Check for winner
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] !== -1 && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 0 ? 'X' : 'O';
        }
    }

    // Check for draw or incomplete
    if (board.includes(-1)) {
        return 'INCOMPLETE';
    } else {
        return 'DRAW';
    }
};

export default gameStatus;
