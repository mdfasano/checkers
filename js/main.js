class CheckersGame {
    constructor (boardElement, messageElement, buttonElement) {
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.buttonElement = buttonElement;
        let tileElements = [...boardElement.querySelectorAll('div')];
        // we can access individual tile divs with tileObjects[index].domEl
        this.tileObjects = [];
        tileElements.forEach((domEl, index) => {
            this.tileObjects.push(new BoardTile(domEl, index));
        });

        this.render();
    }

    /* --- constants defining a game of Checkers --- */
    static BOARD_SIZE = 8

    /* --- necessary variables --- */
    turn;
    winner;

    /* --- funtions --- */

    play () {
        this.turn = 1;
        this.winner = null;
        this.render();
    }

    // setBoard () {
    //     console.log('setting board')
    //     this.tileElements.forEach((tile, index) => {
    //         const thisTile = new BoardTile(tile, index);
    //         if (thisTile.tileColor === 'light') {
    //             if (thisTile.loc.rowIdx < 3) {
    //                 thisTile.playingPieceObj = new CheckersPiece (1, thisTile);
    //             } else if (thisTile.loc.rowIdx > 4) {
    //                 thisTile.playingPieceObj = new CheckersPiece (-1, thisTile);
    //             }
    //         }
    //     });
    // }
    // passed the index of the piece trying to move
    static getMoveChoice (index) {
        console.log(index)
    }
    render () {
        this.renderButtons ();
        this.renderMessage ();
        this.renderBoard ();
    }
    renderButtons () {

    }
    renderMessage () {

    }
    renderBoard () {
        this.tileObjects.forEach((tile) => {
            tile.renderTile(tile);
        });
    }
}


class BoardTile {
    constructor (domEl, index) {
        // domEl is a <div> within the game board
        this.domEl = domEl;
        this.value = null;
        this.loc = BoardTile.getLocIdx(index)
        this.tileColor = this.getTileColor(this.loc);
        this.playingPieceObj = null;
        if (this.tileColor === 'light') {
            if (this.loc.rowIdx < 3) {
                this.playingPieceObj = new CheckersPiece (1, this);
            } else if (this.loc.rowIdx > 4) {
                this.playingPieceObj = new CheckersPiece (-1, this);
            }
        }
    }

    /* -- stored variables -- */


    /* --- render function --- */

    renderTile (tile) {
        if (tile.playingPieceObj != null) {
            tile.playingPiece.renderPiece();
        }

    }
    // converts an index in a 1-D array into 2-D array format
    // returns an object holding the column and row index
    static getLocIdx (index) {
        return {
            oneDIdx: index,
            colIdx: index%CheckersGame.BOARD_SIZE,
            rowIdx: Math.floor(index/CheckersGame.BOARD_SIZE)
        }
    }
    // players can only move here if 
    getTileColor (loc) {
        if ((loc.colIdx + loc.rowIdx) % 2) return 'dark';
        else  return 'light';
    }
}

// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a turn number (1 or -1) 
    // and a parent DOM element
    constructor (turn, tileObj) {
        this.player = turn;
        this.currentTileLoc = tileObj;
        // this.imageEl = parentEl.domElement.firstElementChild;
        // this.imageEl.src = this.imgLookup[this.player];
        tileObj.domEl.addEventListener('click', (event) => {
            this.movePiece(event.target.parentNode);
        })
    }

/* ---- stored variables --- */
    // represents the tile in game board at which this object exists 
    loc = {};

    // array holding locations that can be accessed from current location
    movableLocations = [];
    // uses the p1/p2 values as keys for images
    imgLookup = {
        1: "../images/checkerspiece.png",
        "-1": "../images/checkerspiecedark.jpg"
    }

/* ---- public class functions ----- */

    movePiece (tile) {
        console.log(tile);
        CheckersGame.getMoveChoice(tile.OneDIdx);
    }

    // movement function
    moveTo (colIdx, rowIdx) {
        this.setLocation (colIdx, rowIdx);
    }
    // only called by class
    whereCanIMove () {
        this.movableLocations = []; // clear array
        this.movableLocations.push (this.loc.colIdx + 1, this.loc.rowIdx + this.player);
        this.movableLocations.push (this.loc.colIdx - 1, this.loc.rowIdx + this.player);
    }
    //render function
    renderPiece () {
        this.parentEl.domElement.firstElementChild.src = this.imgLookup[this.player];
    }
    /* ----- private helper functions -----*/
    setLocation (colIdx, rowIdx) {
        this.loc.colIdx = colIdx;
        this.loc.rowIdx = rowIdx;
    }
    getLocation (parentID) {

    }
}

class KingPiece extends CheckersPiece {
    //constructor:

    // special img lookup to signify upgrade
    imgLookup = {
        1: "",
        "-1": ""
    }

    // special movement function
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