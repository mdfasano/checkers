class CheckersGame {
    constructor (boardElement, messageElement) {
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.tileElements = [...boardElement.querySelectorAll('div')];

        this.boardElement.addEventListener('click', event => {
            const idx = this.tileElements.indexOf(event.target);

        })
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
        this.setBoard();
        this.render();
    }

    setBoard () {
        console.log('setting board')
        this.tileElements.forEach((tile, index) => {
            const thisTile = new BoardTile(tile, index);
            if (thisTile.tileColor === 'light') {
                if (thisTile.loc.rowIdx < 3) {
                    thisTile.playingPieceObj = new CheckersPiece (1, thisTile);
                } else if (thisTile.loc.rowIdx > 4) {
                    thisTile.playingP  ieceObj = new CheckersPiece (-1, thisTile);
                }
            }
        });
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
        this.tileElements.forEach(tile => {
            renderTile()
        })
    }
}


class BoardTile {
    constructor (domElement, index) {
        this.domElement = domElement;
        this.value = null;
        this.playingPieceObj = null;
        this.loc = BoardTile.getLocIdx(index)
        this.tileColor = this.getTileColor(this.loc);
    }

    /* -- stored variables -- */


    /* --- render function --- */
    renderTile () {
        this.playingPiece.renderPiece();
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
    constructor (turn, parentEl) {
        this.player = turn;
        this.parentEl = parentEl;
        // this.imageEl = parentEl.domElement.firstElementChild;
        // this.imageEl.src = this.imgLookup[this.player];

        this.imageEl.addEventListener('click', (event) => {
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

export { CheckersGame, BoardTile, CheckersPiece, KingPiece };