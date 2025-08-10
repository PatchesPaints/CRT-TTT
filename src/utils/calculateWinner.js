// utils/calculateWinner.js
// Given the current squares array, determines if there is a winner.
// Returns "X", "O", or null.

export default function calculateWinner(squares) {
  // All possible winning line combinations (by index in squares array)
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  // Loop through all winning lines to see if one is filled
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If square a is filled AND all three match, we have a winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // either "X" or "O"
    }
  }

  // No winner found
  return null;
}
