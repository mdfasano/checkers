class CheckersGame {
    constructor (boardElement, messageElement) {
        this.boardElement = boardElement;
        this.messageElement = messageElement;
        this.tileElements = [...boardElement.querySelectorAll('div')];

        this.boardElement.addEventListener('click', event => {
            const idx = this.tileElements.indexOf(event.target);


            console.log('raw index: ' + idx);
            console.log(BoardTile.getLocationIdx(idx))
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

    }

    setBoard () {
        this.tileElements.forEach((tile, index) => {
            const thisTile = new BoardTile(tile, index);
            if (thisTile.tileColor === 'light') {
                if (thisTile.location.rowIdx < 3) {
                    // make p1 playing piece here
                } else if (thisTile.location.rowIdx > 4) {
                    //make p2 playing piece here
                }
            }
        });
    }
}

class BoardTile {
    constructor (domElement, index) {
        this.domElement = domElement;
        this.value = null;
        this.location = BoardTile.getLocationIdx(index)
        this.tileColor = this.getTileColor(location);
    }

    // converts an index in a 1-D array into 2-D array format
    // returns an object holding the column and row index
    static getLocationIdx (rawIdx) {
        return {
            colIdx: rawIdx%CheckersGame.BOARD_SIZE,
            rowIdx: Math.floor(rawIdx/CheckersGame.BOARD_SIZE)
        }
    }
    // players can only move here if 
    getTileColor (location) {
        if ((location.colIdx + location.rowIdx) % 2) return 'light';
        else return 'dark';
    }
}

export { CheckersGame, BoardTile };