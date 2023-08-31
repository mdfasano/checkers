class CheckersGame {
  constructor(boardElement, messageElement, buttonElement) {
    //cache DOM elements for later use in rendering
    this.boardElement = boardElement;
    this.messageElement = messageElement;
    this.buttonElement = buttonElement;
    this.tileDomEls = [...boardElement.querySelectorAll("div")];

    // an array of 'tiles' that match up with dom elements
    // so we can store gamestate outside the DOM
    this.tileObjects = [];
    for (let i = 0; i < this.tileDomEls.length; i++) {
      this.tileObjects.push(new BoardTile(i));
    }
    // this event listener runs the whole game
    this.boardElement.addEventListener("click", (evt) => this.handleClick(evt));
    this.render();
  }

  /* --- constants defining a game of Checkers --- */
  static BOARD_SIZE = 8;
  playerLookup = {
    1: "black",
    "-1": "white",
  };

  /* --- necessary variables --- */
  turn; // 1 or -1
  winner; // 1, -1, T for tie. null while game being played
  activeTileIdx = null; // used to 'remember' the clicked piece
  captureOptions = []; // used to 'remember' capturable pieces

  /* --- functions --- */
  play() {
    this.turn = 1; // black goes first
    this.winner = null; // we begin with no winner
    this.clearStateVars;
    // display player turn is:...
    // after the first render, game is active and players can progress
    // the game through clicking the board
    this.render();
  }

  handleClick(evt) {
    // convert click target to index
    // index lets us access both versions of clicked tile
    const idx = this.tileDomEls.indexOf(evt.target);
    const clickedTile = this.tileObjects[idx];

    this.checkIfGameOver(); // check board state for winner
    this.checkForCaptures(this.turn); // and for possible captures by current player

    //make sure clicked element is a 'light' board tile
    if (idx === -1 || clickedTile.tileInfo.color === "dark") {
      this.clearStateVars();
      this.checkForCaptures(this.turn);
      this.render();
      return;
    }
    for (let i = 0; i < this.captureOptions.length; i++) {
      let option = this.captureOptions[i];
      this.addMoveable(option.moveTo);
      let moveToIdx = CheckersGame.getIndexFromColRow(option.moveTo);
      // executes if click target is any of...
      if (
        moveToIdx === clickedTile.tileInfo.index || //tile to be moved to after capture
        option.capturingPiece.tileInfo.index === clickedTile.tileInfo.index || //capturing piece
        option.capturedPiece.tileInfo.index === clickedTile.tileInfo.index //captured piece
      ) {
        this.activeTileIdx = option.capturingPiece.tileInfo.index;
        this.makeMove(this.tileObjects[moveToIdx]);
        this.capturePiece(option.capturedPiece);
        this.clearStateVars();
        if (!this.checkForOneCapture(this.tileObjects[moveToIdx], this.turn)) {
          this.turn *= -1;
        }
        this.checkForCaptures(this.turn);
        this.checkIfGameOver();
        this.render();
        return;
      }
    }
    if (this.captureOptions.length === 0) {
      if (clickedTile.playingPiece !== null) {
        // if target contains a piece already...
        this.clearStateVars();
        // if the player clicked on their own piece...
        if (clickedTile.playingPiece.owner === this.turn) {
          this.activeTileIdx = idx;
          const moveOptions = this.getMoveOptions(
            idx,
            clickedTile.playingPiece
          ); // determine where it can move
          moveOptions.forEach((idxColRow) => {
            // add movable to tiles at [options]
            if (idxColRow !== null || idxColRow !== undefined)
              this.addMoveable(idxColRow);
          });
          this.checkIfGameOver();
          this.render();
          return;
        }
        //if target can be moved to, move current piece there
      } else if (clickedTile.canMoveHere === true) {
        this.makeMove(clickedTile);
        if (this.checkIfKing(clickedTile.tileInfo.coords.rowIdx)) {
          clickedTile.playingPiece = clickedTile.playingPiece.kingMe();
        }
        this.turn *= -1;
        this.checkForCaptures(this.turn);
        this.checkIfGameOver();
        this.render();
        return;
      }
    }
  }

  // first clears captureOptions array, then populates that
  //  array with any possible captures by given player
  checkForCaptures(player) {
    this.captureOptions = []; // holds array of objects holding capture info
    for (let i = 0; i < this.tileObjects.length; i++) {
      const thisTile = this.tileObjects[i];
      this.checkForOneCapture(thisTile, player);
    }
  }

  // pushes any captures that can be made from given tile
  // to the captureOptions array
  checkForOneCapture(thisTile, player) {
    const captureInfo = {
      moveTo: null,
      capturingPiece: null,
      capturedPiece: null,
    };
    let canCapture = false;
    if (thisTile.playingPiece && thisTile.playingPiece.owner === player) {
      let moveOptions = thisTile.playingPiece.whereCanIMove(
        thisTile.tileInfo.coords
      );
      moveOptions = moveOptions.filter(this.checkIfInBounds);
      moveOptions = moveOptions.filter((idxColRow) =>
        this.checkForEnemy(idxColRow) ? true : false
      );
      moveOptions.forEach((idxColRow) => {
        const capturedTile =
          this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
        captureInfo.moveTo = this.checkValidCapture(thisTile, capturedTile);
        if (captureInfo.moveTo !== null) {
          captureInfo.capturingPiece = thisTile;
          captureInfo.capturedPiece = capturedTile;
          this.captureOptions.push(captureInfo);
          this.addMoveable(captureInfo.moveTo);
          canCapture = true;
        }
      });
      return canCapture;
    }
  }

  // sets winner variable is a winner
  checkIfGameOver() {
    if (this.checkForLoser(1)) {
      if (this.checkForLoser(-1)) this.winner = "T";
      else this.winner = -1;
    } else if (this.checkForLoser(-1)) {
      this.winner = 1;
    } else this.winner = null;
    this.render();
  }

  // passed player indicator (1/-1)
  // if given player can't make any moves, returns true
  checkForLoser(player) {
    // this.tileObjects.forEach((tile, index) => {
    for (let i = 0; i < this.tileObjects.length; i++) {
      let moveOptions = [];
      let tile = this.tileObjects[i];
      if (
        tile.playingPiece && // if tile has a piece on it and
        tile.playingPiece.owner === player // that piece is owned by player we are checking
      ) {
        moveOptions = this.getMoveOptions(i, tile.playingPiece);
        if (moveOptions.length > 0) return false; // no winner if anything can move
      }
    }
    return true; // inactive player wins!
  }

  // takes an index and a playingPiece obj
  // returns an array that holds coordinate objects
  // assumes there are no pieces to be captured
  getMoveOptions(idx, piece) {
    const idxColRow = CheckersGame.getColRowFromIndex(idx); // calc the col/row of given index
    let moveOptions = piece.whereCanIMove(idxColRow); // ask the playing piece where it can move

    // filter out options that are blocked by other pieces or outside gameboard
    moveOptions = moveOptions.filter(this.checkIfInBounds);
    moveOptions = moveOptions.filter((idxColRow) =>
      this.checkForEmpty(idxColRow) ? true : false
    );

    return moveOptions;
  }

  // moves the piece indicated by activeTileIdx variable
  // to the given tile
  makeMove(tile) {
    this.clearMoveable();
    const tempPiece = this.tileObjects[this.activeTileIdx].playingPiece;
    tile.playingPiece = tempPiece;
    this.tileObjects[this.activeTileIdx].playingPiece = null;
    if (this.checkIfKing(tile.tileInfo.coords.rowIdx)) {
      tile.playingPiece = tile.playingPiece.kingMe();
    }
    this.clearStateVars();
  }

  //deletes a piece from a tile
  capturePiece(tile) {
    tile.playingPiece = null;
  }

  // returns true iff given index is a valid location on gameboard
  checkIfInBounds(idxColRow) {
    if (
      idxColRow.colIdx >= 0 &&
      idxColRow.colIdx < CheckersGame.BOARD_SIZE &&
      idxColRow.rowIdx >= 0 &&
      idxColRow.rowIdx < CheckersGame.BOARD_SIZE
    )
      return true;
    else return false;
  }

  // return true iff tile contains friendly playing piece
  checkForFriendly(idxColRow) {
    const tile = this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
    return tile.playingPiece && tile.playingPiece.owner === this.turn
      ? true
      : false;
  }

  // return true iff tile contains enemy playing piece
  checkForEnemy(idxColRow) {
    const tile = this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
    return tile.playingPiece && tile.playingPiece.owner !== this.turn
      ? true
      : false;
  }

  // returns true if the indicated tile has no piece on it
  checkForEmpty(idxColRow) {
    const tile = this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
    return tile.playingPiece === null ? true : false;
  }

  // returns the resulting coordinates of a capture
  // if that capture is not possible, returns null
  checkValidCapture(capturingTile, capturedTile) {
    const newCoords = CheckersPiece.whereAmIAfterCapture(
      capturingTile.tileInfo.coords, // pass coords of 'active' tile
      capturedTile.tileInfo.coords // and coords of adjacent enemy potentially being captured
    );
    if (
      //check if next tile in path is empty
      this.checkIfInBounds(newCoords) &&
      !this.checkForFriendly(newCoords) &&
      !this.checkForEnemy(newCoords)
    ) {
      // cache the potentially captured tile, and return the location
      // that our mover will be if it captures
      return newCoords;
    } else return null;
  }

  // returns true if the given row is either the first or last row
  checkIfKing(rowIdx) {
    if (rowIdx === 0 || rowIdx === CheckersGame.BOARD_SIZE - 1) return true;
    else return false;
  }

  // changes the 'moveable' bool to true for the tile at given index
  addMoveable(idxColRow) {
    const idx = CheckersGame.getIndexFromColRow(idxColRow);
    this.tileObjects[idx].canMoveHere = true;
  }

  // sets ALL 'movable' booleans to false
  clearMoveable() {
    this.tileObjects.forEach((tile) => {
      tile.canMoveHere = false;
    });
  }

  // resets the variables we use to remember past player clicks
  clearStateVars() {
    this.clearMoveable();
    this.activeTileIdx = null;
    this.captureOptions = [];
  }

  // converts an index in a 1-D array into 2-D array format
  // returns an object holding the column and row index
  static getColRowFromIndex(index) {
    return {
      colIdx: index % CheckersGame.BOARD_SIZE,
      rowIdx: Math.floor(index / CheckersGame.BOARD_SIZE),
    };
  }

  static getIndexFromColRow(idxColRow) {
    return idxColRow.colIdx + idxColRow.rowIdx * CheckersGame.BOARD_SIZE;
  }

  render() {
    this.renderButtons();
    this.renderMessage();
    this.renderBoard();
  }

  renderButtons() {
    // hide play again button if there is no winner (default state)
    if (this.winner !== null) {
      this.buttonElement.style.visibility = "visible";
      this.buttonElement.innerText = "play again?";
    } else this.buttonElement.style.visibility = "hidden";
  }

  renderMessage() {
    // inner text set to string indicated by 'turn' value
    this.messageElement.innerText = `${this.playerLookup[this.turn]}'s turn`;
    if (this.winner !== null) {
      this.messageElement.innerText = `${this.playerLookup[this.winner]} wins`;
    }
  }

  renderBoard() {
    this.tileObjects.forEach((tile, index) => {
      tile.renderTile(this.tileDomEls[index]);
    });
  }
}

class BoardTile {
  constructor(index) {
    this.canMoveHere = false;
    this.playingPiece = null;
    this.tileInfo.index = index;
    this.tileInfo.coords = BoardTile.getLocIdx(index);
    this.tileInfo.color = this.getTileColor();
    if (this.tileInfo.color === "dark") this.playingPiece = null;
    else {
      if (this.tileInfo.coords.rowIdx < 3) {
        this.playingPiece = new CheckersPiece(1); //1 to represent dark color pieces;
      } else if (this.tileInfo.coords.rowIdx > 4) {
        this.playingPiece = new CheckersPiece(-1); // -1 to represent light color pieces;
      }
    }
  }

  /* -- stored variables -- */
  tileInfo = {
    // constants that define the tile.
    index: null, // a 1 dimensional index
    coords: {}, // holds 2 values that represent tile location in a 2d array
    color: null, // the color of the tile (helps determine if it is playable)
  };
  // a boolean value that can be set to true if the selected piece
  // can move to this tile
  canMoveHere;
  // is either null, or holds an object for a playing piece that
  // occupies this tile
  playingPiece;

  /* --- render function --- */
  renderTile(domEl) {
    // takes in the domEl this will be rendering on, and passes
    // it to the playing piece object
    if (this.playingPiece != null) {
      this.playingPiece.renderPiece(domEl);
    } else CheckersPiece.renderRemovePiece(domEl);
    if (this.canMoveHere) domEl.classList.add("moveable");
    else domEl.classList.remove("moveable");
  }
  // converts an index in a 1-D array into 2-D array format
  // returns an object holding the column and row index
  static getLocIdx(index) {
    return {
      colIdx: index % CheckersGame.BOARD_SIZE,
      rowIdx: Math.floor(index / CheckersGame.BOARD_SIZE),
    };
  }
  // players can only move here if tile is light colored
  getTileColor() {
    if ((this.tileInfo.coords.colIdx + this.tileInfo.coords.rowIdx) % 2)
      return "dark";
    else return "light";
  }
}

// a class for all playing pieces used in a checkers game
class CheckersPiece {
  // takes a number (1 or -1) to signify which players turn it is
  constructor(owner) {
    this.owner = owner;
  }

  // uses the p1/p2 values as keys for classes
  // manipulated to display different team checkers piece colors
  static classLookup = {
    1: "team-black",
    "-1": "team-white",
  };

  /* ---- class functions ----- */
  kingMe() {
    return new KingPiece(this.owner);
  }

  // takes a location object holding col and row values
  // returns an array of col/row pairs for each possible move it can make
  whereCanIMove(idxColRow) {
    const moveOptions = [];
    const col = idxColRow.colIdx;
    const row = idxColRow.rowIdx + this.owner;

    moveOptions.push(this.makeLocationObj(col + 1, row));
    moveOptions.push(this.makeLocationObj(col - 1, row));
    return moveOptions;
  }

  // returns the coordinates a piece would be at if it initiated a
  // capture from the positions described by params
  static whereAmIAfterCapture(startingCoords, capturedPieceCoords) {
    const newColMod = capturedPieceCoords.colIdx - startingCoords.colIdx;
    const newRowMod = capturedPieceCoords.rowIdx - startingCoords.rowIdx;
    return {
      colIdx: capturedPieceCoords.colIdx + newColMod,
      rowIdx: capturedPieceCoords.rowIdx + newRowMod,
    };
  }

  // packs col and row numbers into an object
  // with appropriate key names
  makeLocationObj(col, row) {
    const locObj = {
      colIdx: col,
      rowIdx: row,
    };
    return locObj;
  }

  //render function
  renderPiece(domEl) {
    CheckersPiece.renderRemovePiece(domEl);
    domEl.classList.add(CheckersPiece.classLookup[this.owner]);
  }

  static renderRemovePiece(domEl) {
    domEl.classList.remove("king");
    domEl.classList.remove(CheckersPiece.classLookup[1]);
    domEl.classList.remove(CheckersPiece.classLookup[-1]);
  }
}

class KingPiece extends CheckersPiece {
  constructor(turn) {
    super(turn);
  }

  // special movement function
  whereCanIMove(idxColRow) {
    const moveOptions = [];
    const col = idxColRow.colIdx;
    const row1 = idxColRow.rowIdx + this.owner;
    const row2 = idxColRow.rowIdx - this.owner;

    moveOptions.push(this.makeLocationObj(col + 1, row1));
    moveOptions.push(this.makeLocationObj(col - 1, row1));
    moveOptions.push(this.makeLocationObj(col + 1, row2));
    moveOptions.push(this.makeLocationObj(col - 1, row2));
    return moveOptions;
  }

  // special render function
  renderPiece(domEl) {
    super.renderPiece(domEl);
    domEl.classList.add("king");
  }
}

/* ---- state variables ---- */
let game;

/* ---- cached dom elements ---*/
const boardEl = document.getElementById("game-board");
const messageEl = document.getElementById("message-area");
const buttonEl = document.getElementById("play-again");

/* --- functions --- */
function initialize() {
  game = new CheckersGame(boardEl, messageEl, buttonEl);
  game.play();
}

/* --- run the game --- */
buttonEl.innerText = "Play Checkers?";
buttonEl.addEventListener("click", () => initialize());
