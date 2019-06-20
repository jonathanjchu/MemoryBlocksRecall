import React, { Component } from 'react';
import './App.css';


const STATES = {
  BLANK: 0,
  SELECTED: 1,
  USER_CHOICE: 2,
  WRONG: 3,
  CORRECT: 4
}

const TILES = [
  "white",
  "blue",
  "yellow",
  "red",
  "green"
]

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameTiles: [[0, 0, 0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0]],

      displayTiles: [[0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],

      timeRemaining: null,
      timer: null,
      isLocked: true,

      btnText: "Start Game"
    };
  }

  startGame(e) {
    let rndTiles = [[0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]];

    let rndInts = this.getFourRandomPositions();
    let rPos = 0;

    for (let i = 0; i < rndTiles.length; i++) {
      for (let j = 0; j < rndTiles[i].length; j++) {
        if (rndInts[rPos] === i * 4 + j) {
          rndTiles[i][j] = STATES.SELECTED;
          rPos++;
        }
      }
    }

    this.setState({
      displayTiles: rndTiles,
      gameTiles: rndTiles,
      btnText: null
    });

    setTimeout(this.hideCards.bind(this), 80);
  }

  getFourRandomPositions() {
    let rndInts = [];

    rndInts.push(Math.floor(Math.random() * 12));

    while (rndInts.length < 4) {
      let rnd = Math.floor(Math.random() * 12);
      if (!rndInts.includes(rnd)) {
        rndInts.push(rnd);
      }
    }

    rndInts.sort((a, b) => { return a - b });

    return rndInts;
  }

  hideCards() {
    this.setState({
      displayTiles: [[0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
      timeRemaining: 3,
      timer: setInterval(this.countDown.bind(this), 1000),
      isLocked: false
    });
  }

  countDown() {
    let timeRemaining = this.state.timeRemaining;

    timeRemaining--;

    if (timeRemaining === 0) {
      timeRemaining = null;
      clearInterval(this.state.timer);
      this.revealAnswers();
    }

    this.setState({ timeRemaining: timeRemaining });
  }

  revealAnswers() {
    let userSelection = [...this.state.displayTiles];
    let gameTiles = [...this.state.gameTiles];
    let displayTiles = [[0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]];


    for (let i = 0; i < userSelection.length; i++) {
      for (let j = 0; j < userSelection[i].length; j++) {
        if (userSelection[i][j] === STATES.USER_CHOICE
          && gameTiles[i][j] === STATES.SELECTED) {
          displayTiles[i][j] = STATES.CORRECT;
        }
        else if (userSelection[i][j] === STATES.USER_CHOICE
          && gameTiles[i][j] !== STATES.SELECTED) {
          displayTiles[i][j] = STATES.WRONG;
        }
        else if (userSelection[i][j] === STATES.BLANK
          && gameTiles[i][j] === STATES.SELECTED) {
          displayTiles[i][j] = STATES.SELECTED;
        }
      }
    }

    this.setState({
      displayTiles: displayTiles,
      isLocked: true,
      btnText: "Play Again"
    });
  }

  toggleCard(x, y) {
    if (!this.state.isLocked) {
      let displayTiles = [...this.state.displayTiles];

      if (displayTiles[y][x] === STATES.BLANK)
        displayTiles[y][x] = STATES.USER_CHOICE;
      else
        displayTiles[y][x] = STATES.BLANK;

      this.setState({ displayTiles: displayTiles });
    }
  }

  render() {
    let button = null;
    if (this.state.btnText !== null) {
      button = <button onClick={this.startGame.bind(this)}>{this.state.btnText}</button>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Memory Game</h1>
          <h5>(blue cells will flash on the screen, then you have 3 seconds to recall which ones were blue)</h5>
          <div className="text">{this.state.timeRemaining} &nbsp;</div>
          {
            this.state.displayTiles.map((tiles, i) =>
              <div className="row" key={i}>
                {
                  tiles.map((t, j) =>
                    <Tile key={i * 4 + j} value={t} x={j} y={i} onClick={this.toggleCard.bind(this)} />
                  )
                }
              </div>
            )
          }
          <div className="text">
            {button}
        </div>
        </header>
      </div>
    );
  }
}


class Tile extends Component {
  constructor(props) {
    super(props);
  }

  toggleClick() {
    this.props.onClick(this.props.x, this.props.y);
  }

  render() {
    let divClass = "col ";
    divClass += TILES[this.props.value];

    return (
      <div className={divClass} onClick={this.toggleClick.bind(this)}></div>
    );
  }

}

export default App;