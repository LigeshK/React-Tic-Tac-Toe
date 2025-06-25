import { useState } from "react";
import { GameBoard } from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";
import GameOver from "./components/GameOver";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
// Define the initial player names for X and O
const INITIAL_PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

function deriveGameBoard(gameTurns) {
  const gameBoard = [...INITIAL_GAME_BOARD].map((row) => [...row]); // Create a copy of the initial game board
  //Produce derived state from turns
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner = null;
  // Check for a winner after each turn
  for (const winningCombination of WINNING_COMBINATIONS) {
    const [first, second, third] = winningCombination;
    const firstSquare = gameBoard[first.row][first.column];
    const secondSquare = gameBoard[second.row][second.column];
    const thirdSquare = gameBoard[third.row][third.column];

    if (
      firstSquare &&
      firstSquare === secondSquare &&
      firstSquare === thirdSquare
    ) {
      console.log(`Player ${firstSquare} wins!`);
      winner = players[firstSquare]; // Set the winner

      break; // Exit the loop once a winner is found
    }
  }
  return winner;
}

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  //Instead of using activePlayer, we can derive it from gameTurns
  //const [activePlayer, setActivePlayer] = useState("X");

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns); // Derive the game board from the turns
  const winner = deriveWinner(gameBoard, players); // Check for a winner after each turn
  // If no winner is found, check for a draw
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      let curActivePlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: curActivePlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={players.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={players.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        {/* <GameBoard onSelectSquare={handleSelectSquare} turns={gameTurns} /> */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
