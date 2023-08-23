// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a player signifier and 
    // col/row indeced to represent location on game board
    constructor () {
        if (arguments.length >= 3) {
            // expected case
            this.player = arguments[0];
            this.setLocation (arguments[1], arguments[2]);
        } else if (arguments)
        if (arguments.length === 0) {
            // if no parameters passed, a new object is created with both
            // location and player as null
            this.player = null;
            this.setLocation (null, null);
        } else if (arguments.length === 1) {
            // when one parameter is passed, it is treated as the 
            // player indicator. The location is set to null
            this.player = arguments[0];
            this.setLocation (null, null)
        } else if (arguments.length === 2) {
            // when two parameters are passed, assumes that they represent
            // col and row index (in that order) and sets 
            // player indicator as null
            this.setLocation (arguments[0], arguments[1]);
            this.player = null;
        }
    }

/* ---- stored variables --- */
    // represents the tile in game board at which this object exists 
    location = {};
    // uses the p1/p2 values as keys for images
    imgLookup = {
        1: "../images/checkerspiece.png",
        "-1": "../images/checkerspiece.png" 
    }

/* ---- public class functions ----- */

    //movement function
    moveTo (colIdx, rowIdx) {
        this.setLocation (colIdx, rowIdx);
    }
    //render function

    /* ----- private helper functions -----*/
    setLocation (colIdx, rowIdx) {
        this.location.colIdx = colIdx;
        this.location.rowIdx = rowIdx;
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




module.exports = {
    CheckersPiece,
    KingPiece
}