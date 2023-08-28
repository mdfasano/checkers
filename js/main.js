class CheckersGame {
    constructor (boardElement, messageElement, buttonElement) {
        //cache DOM elements for later use in rendering
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.buttonElement = buttonElement;
        let tileElements = [...boardElement.querySelectorAll('div')];

        // we can access individual tile divs with tileObjects[index].domEl
        this.tileObjects = [];
        tileElements.forEach((domEl, index) => {
            const tileObj = {};
            tileObj.domEl = domEl;
            tileObj.jsEl = new BoardTile(index);
            this.tileObjects.push(tileObj);
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
        this.tileObjects.forEach((tileObj) => {
            tileObj.jsEl.renderTile(tileObj.domEl);
        });
    }
}


class BoardTile {
    constructor (index) {
        this.loc = BoardTile.getLocIdx(index)
        this.tileColor = BoardTile.getTileColor(this.loc);
        if (this.tileColor === 'dark') this.playingPiece = null;
        else {
            if (this.loc.rowIdx < 3) {
                this.playingPiece = new CheckersPiece(1) //1 to represent dark color pieces;
            } else if (this.loc.rowIdx > 4) {
                this.playingPiece = new CheckersPiece (-1) // -1 to represent light color pieces;
            }
        }
    }

    /* -- stored variables -- */


    /* --- render function --- */

    renderTile (domEl) {
        // takes in the domEl this will be rendering on, and passes
        // it to the playing piece object
        if (this.playingPiece != null) {
            this.playingPiece.renderPiece(domEl);
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
    static getTileColor (loc) {
        if ((loc.colIdx + loc.rowIdx) % 2) return 'dark';
        else  return 'light';
    }
}

// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a number (1 or -1) to signify which players turn it is
    constructor (player) {
        this.player = player;
    }

/* ---- stored variables --- */
    // represents the tile in game board at which this object exists 
    loc = {};

    // array holding locations that can be accessed from current location
    movableLocations = [];

    // uses the p1/p2 values as keys for classes 
    // manipulated to display different team checkers piece colors
    static classLookup = {
        1: "team-black",
        "-1": "team-white"
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
    renderPiece (domEl) {
        console.log(CheckersPiece.classLookup[this.player])
        domEl.classList.add(CheckersPiece.classLookup[this.player]);
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