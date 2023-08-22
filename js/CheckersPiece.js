// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a player signifier and 
    // col/row indeced to represent location on game board
    constructor (player, colIdx, rowIdx) {
        if (arguments.length >= 3) {
            // expected case
            this.player = player;
            this.location.colIdx = colIdx;
            this.location.rowIdx = rowIdx;
        } else if (arguments)
        if (arguments.length === 0) {
            this.player = null;
            this.location = null;
        } else {

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
    //render function
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