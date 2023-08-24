import { CheckersPiece } from "./CheckersPiece.js";

class CheckersGame {
    constructor (boardElement, messageElement) {
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.tileElements = [...boardElement.querySelectorAll('div')];

        this.boardElement.addEventListener('click', event => {
            const idx = this.tileElements.indexOf(event.target);


            console.log('raw index: ' + idx);
            console.log(BoardTile.getLocIdx(idx))
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
                console.log(thisTile )
                if (thisTile.loc.rowIdx < 3) {
                    new CheckersPiece (1, thisTile)
                } else if (thisTile.loc.rowIdx > 4) {
                    new CheckersPiece (-1, thisTile)
                }
            }
        });
    }
    render () {
        renderButtons ();
        renderMessage ();
        renderBoard ();
    }
    renderButtons () {

    }
    renderMessage () {

    }
    renderBoard () {
        
    }
}


class BoardTile {
    constructor (domElement, index) {
        console.log('making tile');
        this.domElement = domElement;
        this.value = null;
        this.loc = BoardTile.getLocIdx(index)
        this.tileColor = this.getTileColor(this.loc);
        console.log(this.tileColor)
    }

    // converts an index in a 1-D array into 2-D array format
    // returns an object holding the column and row index
    static getLocIdx (rawIdx) {
        return {
            colIdx: rawIdx%CheckersGame.BOARD_SIZE,
            rowIdx: Math.floor(rawIdx/CheckersGame.BOARD_SIZE)
        }
    }
    // players can only move here if 
    getTileColor (loc) {
        if ((loc.colIdx + loc.rowIdx) % 2) return 'dark';
        else  return 'light';
    }
}

export { CheckersGame, BoardTile };