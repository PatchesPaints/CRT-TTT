// utils/getWinningLine.js
// Returns the winning triple of indices [a,b,c] if there is a win; otherwise null.

export default function getWinningLine(squares) { // export the function
  const lines = [                                  // define all winning lines
    [0, 1, 2],                                     // top row
    [3, 4, 5],                                     // middle row
    [6, 7, 8],                                     // bottom row
    [0, 3, 6],                                     // left column
    [1, 4, 7],                                     // middle column
    [2, 5, 8],                                     // right column
    [0, 4, 8],                                     // diagonal TL-BR
    [2, 4, 6],                                     // diagonal TR-BL
  ];                                               // end lines

  for (let i = 0; i < lines.length; i++) {         // loop possible wins
    const [a, b, c] = lines[i];                    // destructure line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];                            // return the winning triple
    }
  }                                                // end loop

  return null;                                     // no win found
}                                                  // end function
