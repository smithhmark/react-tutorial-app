import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={props.winner ? "winningsquare" : "square"}
      onClick={() => props.onClick()} >
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winner;
    if (this.props.winners) {
      winner = false;
      for (var ii = 0 ; ii < this.props.winners.length ; ii++) {
        if (i === this.props.winners[ii]) {
          winner = true;
        }
      }
    } else {
      winner = false;
    }
    return <Square
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      winner={winner} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  reset(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step %2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ?  'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)
    const draw = calculateDraw(current.squares)

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (draw) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ?  'X' : 'O');
    }
    let winningSquares;
    if (winner) {
      winningSquares = findWinners(current.squares);
    } else {
      winningSquares = null;
    }

    const moves = history.map((step, move) => {
      const desc = move ? 
        "Go to move #" + move :
        'Go to game start';
      return (
        <li key={move}> 
        <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>);
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winners={winningSquares} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {(winner || draw) &&
          <div><button onClick={()=>this.reset()}>Play again</button></div>}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function findWinners(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function calculateWinner(squares) {
  const sqrs = findWinners(squares);
  if (sqrs){
    return squares[sqrs[0]];
  }
  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null ){
      return false;
    }
  }
  return true
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

