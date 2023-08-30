class CheckersGame {
    constructor (boardElement, messageElement, buttonElement) {
        //cache DOM elements for later use in rendering
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.buttonElement = buttonElement;
        this.tileElements = [...boardElement.querySelectorAll('div')];

        // we can access individual tile divs with tileObjects[index].domEl
        this.tileObjects = [];
        this.tileElements.forEach((domEl, index) => {
            const tileObj = {};
            tileObj.domEl = domEl;
            tileObj.jsEl = new BoardTile(index);
            this.tileObjects.push(tileObj);
        });
        this.boardElement.addEventListener('click', (evt) => this.handleClick(evt));

        this.render();
    }

    /* --- constants defining a game of Checkers --- */
    static BOARD_SIZE = 8

    /* --- necessary variables --- */
    turn;
    winner;

    /* --- funtions --- */
 
    play () {
        this.turn = -1;
        this.winner = null;
        this.render();
    }

    handleClick (evt) {
        // if target contains a piece already, check movement options
        // else if target can be moved to, move current piece there
        this.clearMoveable();
        let idx = this.tileElements.indexOf(evt.target);
        console.log('clicked the board')
        const moveOptions = this.tileObjects[idx].jsEl.checkMoveOptions (this.turn); // return array of index vals
        moveOptions.forEach(idx => {
            console.log(idx);
            const tileOwner = this.checkForPiece(idx);
            this.addMoveable (this.tileElements[idx])
            return idx;
        });
    }

    // return true iff has a piece AND that is an enemy
    checkForPiece (idx) {
        const piece = this.tileObjects[idx].jsEl.tileInfo.playingPiece;
        if (piece === null) return 0;
        else return piece.player;
    }
    addMoveable (domEl) {
        domEl.classList.add('moveable');
    }
    clearMoveable () {
        this.tileElements.forEach((el) => {
            el.classList.remove('moveable');
        })
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
        this.tileInfo.index = index;
        this.tileInfo.coords = BoardTile.getLocIdx(index);
        this.tileInfo.color = this.getTileColor(this.tileInfo.index);
        if (this.tileInfo.color === 'dark') this.tileInfo.playingPiece = null;
        else {
            if (this.tileInfo.coords.rowIdx < 3) {
                this.tileInfo.playingPiece = new CheckersPiece(1) //1 to represent dark color pieces;
            } else if (this.tileInfo.coords.rowIdx > 4) {
                this.tileInfo.playingPiece = new CheckersPiece (-1) // -1 to represent light color pieces;
            }
        }
    }

    /* -- stored variables -- */
    tileInfo = {
        index: null,
        coords: {},
        color: null,
        playingPiece: null
    };

    /* --- render function --- */

    renderTile (domEl) {
        // takes in the domEl this will be rendering on, and passes
        // it to the playing piece object
        if (this.tileInfo.playingPiece != null) {
            this.tileInfo.playingPiece.renderPiece(domEl);
        }

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
    // returns true iff given index is in bounds 
    isInBounds (rawIdx) {
        const loc = BoardTile.getLocIdx(rawIdx);
        const rowCompare = loc.rowIdx - this.tileInfo.coords.rowIdx;
        console.log(loc + ' checking isingbounds')
        if (
            loc.colIdx >= 0 && loc.colIdx < CheckersGame.BOARD_SIZE &&  // col# inside playing grid
            loc.rowIdx >= 0 && loc.rowIdx < CheckersGame.BOARD_SIZE     // row# inside playing grid
        ) if (rowCompare*rowCompare === 1) return true;
        else return false;
    }
    checkMoveOptions (turn) {
        let viableLocations = [];
        if (this.tileInfo.color === 'light') { // return if invalid tile
            if (this.tileInfo.playingPiece) { // only call function if tile contains a playing piece
                console.log ('inside tile')
                let incrementors = this.tileInfo.playingPiece.whereCanIMove(turn);
                viableLocations = incrementors.map(incr => incr += this.tileInfo.index);
                viableLocations = viableLocations.filter(tileIdx => this.isInBounds(tileIdx) ? true : false);
            }
        }
        return viableLocations;
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
    kingMe () {
        return new KingPiece (this.player);
    }

    movePiece (tile) {
        console.log(tile);
        CheckersGame.getMoveChoice(tile.OneDIdx);
    }

    // movement function
    moveTo (colIdx, rowIdx) {
        this.setLocation (colIdx, rowIdx);
    }

    whereCanIMove (turn) {
        const incrementors = []
        const base = (CheckersGame.BOARD_SIZE * this.player);
        if (turn === this.player) {
            incrementors.push(base + 1);
            incrementors.push(base - 1);
        }
        return incrementors;
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
    constructor (player) {
        super(player);
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