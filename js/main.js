class CheckersGame {
    constructor (boardElement, messageElement, buttonElement) {
        //cache DOM elements for later use in rendering
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.buttonElement = buttonElement;
        this.tileDomEls = [...boardElement.querySelectorAll('div')];

        // an array of 'tiles' that match up with dom elements
        // so we can store gamestate outside the DOM
        this.tileObjects = [];
        for (let i = 0; i < this.tileDomEls.length; i++) {
            this.tileObjects.push(new BoardTile(i));
        }
        // this event listener runs the whole game
        this.boardElement.addEventListener('click', (evt) => this.handleClick(evt));

        this.render();
    }

    /* --- constants defining a game of Checkers --- */
    static BOARD_SIZE = 8

    playerLookup = {
        1: 'black',
        '-1': 'white'
    }

    /* --- necessary variables --- */
    turn; // 1 or -1
    winner; // 1, -1, T for tie. null while game being played
    activeTileIdx = null;
    tilesToBeCaptured = {}
    /* --- funtions --- */
    play () {
        this.turn = 1; // black goes first
        this.winner = null; // we begin with no winner
    
        // display player turn is:...
        // after the first render, game is active and players can progress
        // the game through clicking the board
        this.render();
    }

    handleClick (evt) {
        // convert click target to index
        // index lets us access both versions of clicked tile
        const idx = this.tileDomEls.indexOf(evt.target);
        const clickedTile = this.tileObjects[idx];
        //make sure clicked element is a board tile
        if (idx === -1 || clickedTile.tileInfo.color === 'dark') {
            this.activeTile = null;
            this.clearMoveable(); 
        } else if (clickedTile.playingPiece !== null) {
        // if target contains a piece already...
            this.clearMoveable();
            // if the player clicked on their own piece... 
            if (clickedTile.playingPiece.owner === this.turn) {
                this.activeTileIdx = idx;
                this.prepForMove(idx, clickedTile.playingPiece); // determine where it can move

            }
            //if target can be moved to, move current piece there
        } else if (clickedTile.canMoveHere === true) {
            this.makeMove(clickedTile)
            }

        else this.clearMoveable()



        // this.clearMoveable();
        // // let idx = this.tileDomEls.indexOf(evt.target);
        // console.log('clicked the board')
        // const moveOptions = this.tileObjects[idx].checkMoveOptions (this.turn); // return array of index vals
        // moveOptions.forEach(idx => {
        //     console.log(idx);
        //     const tileOwner = this.checkForPiece(idx);
        //     this.addMoveable (this.tileDomEls[idx])
        //     return idx;
        // });
        this.render ();
    }

    // takes an index, a turn indicator, and a playingPiece obj
    prepForMove (idx, piece) {
        const idxColRow = CheckersGame.getColRowFromIndex (idx); // calc the col/row if given index
        let moveOptions = piece.whereCanIMove(idxColRow) // ask the playing piece where it can move
        moveOptions = moveOptions.filter(this.checkIfInBounds) // remove options outside gameboard
        // check for friendly tiles at [options]
        moveOptions = moveOptions.filter((idxColRow) => {
            // filter out options that are blocked by same team pieces
            if (this.checkForFriendly(idxColRow)) return true
            else return false
        });
        // check for enemy tiles at [options]
        moveOptions = moveOptions.map ((idxColRow) => this.checkForEnemy(idxColRow));
        //      -> generate new option by extrapolating rule
        //      ...later
        moveOptions = moveOptions.filter ((el) => el === null ? false : true);
        // add movable to tiles at [options]
        moveOptions.forEach((idxColRow) => {
            this.addMoveable(idxColRow);
        });
    }
    makeMove (tile) {
        const tempPiece = this.tileObjects[this.activeTileIdx].playingPiece;
        tile.playingPiece = tempPiece;
        this.tileObjects[this.activeTileIdx].playingPiece = null;
        if (this.tilesToBeCaptured[tile.tileInfo.index]) { // if we are making a capture delete captured piece
            this.tilesToBeCaptured[tile.tileInfo.index].playingPiece = null;
        }
        this.clearMoveable();
        this.clearToBeCaptured();
        this.turn *= -1;
    }
    // returns true iff given index is a valid location on gameboard
    checkIfInBounds (idxColRow) {
        if (idxColRow.colIdx >= 0 &&
            idxColRow.colIdx < CheckersGame.BOARD_SIZE &&
            idxColRow.rowIdx >= 0 &&
            idxColRow.rowIdx < CheckersGame.BOARD_SIZE
            ) return true;
            else return false;
    }
    checkForFriendly (idxColRow) {
        const tile = this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
        return (tile.playingPiece && tile.playingPiece.owner === this.turn) ? false : true;
    }
    checkForEnemy (idxColRow) {
        const tile = this.tileObjects[CheckersGame.getIndexFromColRow(idxColRow)];
        if (tile.playingPiece && tile.playingPiece.owner !== this.turn) {
            // if the tile is an enemy
            const newCoords = CheckersPiece.whereAmIAfterCapture(
                // get the tile that we would end up at if a capture happened here
                CheckersGame.getColRowFromIndex(this.activeTileIdx), // pass coords of 'active' tile
                idxColRow   // and coords of adjacent enemy potentially being captured
            );
            if ( //check if next tile in path is empty
                this.checkIfInBounds(newCoords) &&
                this.checkForFriendly(newCoords) &&
                this.checkForEnemy(newCoords)
            ) {
                // cache the potentially captured tile, and return the location
                // that our mover will be if it captures
                this.tilesToBeCaptured[CheckersGame.getIndexFromColRow(newCoords)] = tile;
                return newCoords;
            }
            else return null;
        } else return idxColRow;
    }
    // changes the 'moveable' bool to true for the 
    // tile at given index
    addMoveable (idxColRow) {
        const idx = CheckersGame.getIndexFromColRow(idxColRow);
        this.tileObjects[idx].canMoveHere = true;
    }
    // sets ALL 'movable' booleans to false
    clearMoveable () {
        this.tileObjects.forEach((tile) => {
            tile.canMoveHere = false;
        })
    }
    clearToBeCaptured () {
        this.tilesToBeCaptured = {};
    }

    // converts an index in a 1-D array into 2-D array format
    // returns an object holding the column and row index
    static getColRowFromIndex (index) {
        return {
            colIdx: index%CheckersGame.BOARD_SIZE,
            rowIdx: Math.floor(index/CheckersGame.BOARD_SIZE)
        }
    }
    static getIndexFromColRow (idxColRow) {
        return idxColRow.colIdx + (idxColRow.rowIdx * CheckersGame.BOARD_SIZE);
    }
    render () {
        this.renderButtons ();
        this.renderMessage ();
        this.renderBoard ();
    }
    renderButtons () {
        // hide play again button if there is no winner (default state)
        if (this.winner !== null) {
            this.buttonElement.style.visibility = 'visible';
        } else this.buttonElement.style.visibility = 'hidden';
    }
    renderMessage () {
        // inner text set to string indicated by 'turn' value
        this.messageElement.innerText = `${this.playerLookup[this.turn]}'s turn`;
    }
    renderBoard () {
        this.tileObjects.forEach((tile, index) => {
            tile.renderTile(this.tileDomEls[index]);
        });
    }
}


class BoardTile {
    constructor (index) {
        this.canMoveHere = false;
        this.playingPiece = null;
        this.tileInfo.index = index;
        this.tileInfo.coords = BoardTile.getLocIdx(index);
        this.tileInfo.color = this.getTileColor(this.tileInfo.index);
        if (this.tileInfo.color === 'dark') this.playingPiece = null;
        else {
            if (this.tileInfo.coords.rowIdx < 3) {
                this.playingPiece = new CheckersPiece(1) //1 to represent dark color pieces;
            } else if (this.tileInfo.coords.rowIdx > 4) {
                this.playingPiece = new CheckersPiece (-1) // -1 to represent light color pieces;
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
    renderTile (domEl) {
        // takes in the domEl this will be rendering on, and passes
        // it to the playing piece object
        if (this.playingPiece != null) {
            this.playingPiece.renderPiece(domEl);
        } else CheckersPiece.renderRemovePiece(domEl);
        if (this.canMoveHere) domEl.classList.add('moveable');
        else domEl.classList.remove('moveable');

    }
    // converts an index in a 1-D array into 2-D array format
    // returns an object holding the column and row index
    static getLocIdx (index) {
        return {
            colIdx: index%CheckersGame.BOARD_SIZE,
            rowIdx: Math.floor(index/CheckersGame.BOARD_SIZE)
        }
    }
    // players can only move here if tile is light colored
    getTileColor (index) {
        if ((this.tileInfo.coords.colIdx + this.tileInfo.coords.rowIdx) % 2) return 'dark';
        else  return 'light';
    }
}

// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a number (1 or -1) to signify which players turn it is
    constructor (owner) {
        this.owner = owner;
    }

    // uses the p1/p2 values as keys for classes 
    // manipulated to display different team checkers piece colors
    static classLookup = {
        1: "team-black",
        "-1": "team-white"
    }

/* ---- public class functions ----- */
    kingMe () {
        return new KingPiece (this.player);
    }

    // takes a location object holding col and row values
    // returns an array of col/row pairs for each possible move it can make
    whereCanIMove (idxColRow) {
        const moveOptions = []
        const col = idxColRow.colIdx;
        const row = idxColRow.rowIdx + this.owner;

        moveOptions.push(this.makeLocationObj(col + 1, row));
        moveOptions.push(this.makeLocationObj(col - 1, row));
        return moveOptions;
    }
    // returns the coordinates a piece would be at if it initiated a 
    // capture from the positions described by params
    static whereAmIAfterCapture (startingCoords, capturedPieceCoords) {
        const newColMod = capturedPieceCoords.colIdx - startingCoords.colIdx;
        const newRowMod = capturedPieceCoords.rowIdx - startingCoords.rowIdx;
        return {
            colIdx: capturedPieceCoords.colIdx + newColMod,
            rowIdx: capturedPieceCoords.rowIdx + newRowMod
        }
    }
    // packs col and row numbers into an object
    // with appropriate key names
    makeLocationObj (col, row) {
        const locObj = {
            colIdx: col,
            rowIdx: row
        }
        return locObj
    }

    //render function
    renderPiece (domEl) {
        domEl.classList.add(CheckersPiece.classLookup[this.owner]);
    }
    static renderRemovePiece (domEl) {
        domEl.classList.remove(CheckersPiece.classLookup[1])
        domEl.classList.remove(CheckersPiece.classLookup[-1])
    }
}

class KingPiece extends CheckersPiece {
    constructor (turn) {
        super(turn);
    }

    // special movement function

    // special render function 
    renderPiece (domEl) {
        super.renderPiece(domEl);
        domEl.classList.add('king');
    }
}

/* ---- state variables ---- */
let game;

/* ---- cached dom elements ---*/
const boardEl = document.getElementById('game-board');
const messageEl = document.getElementById('message-area');
const buttonEl = document.getElementById('button-area');

/* --- functions --- */
initialize ();

function initialize () {
    game = new CheckersGame(boardEl, messageEl, buttonEl);
    game.play();

}