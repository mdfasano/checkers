// a class for all playing pieces used in a checkers game
class CheckersPiece {
    // takes a turn number (1 or -1) 
    // and a parent DOM element
    constructor (turn, parentEl) {
        this.player = turn;
        this.parentEl = parentEl;
        parentEl.domElement.innerHTML = this.imgLookup[this.player];
    }

/* ---- stored variables --- */
    // represents the tile in game board at which this object exists 
    loc = {};

    // array holding locations that can be accessed from current location
    movableLocations = [];
    // uses the p1/p2 values as keys for images
    imgLookup = {
        1: '<img class="checkers-piece" src="../images/checkerspiece.png">',
        "-1": '<img class="checkers-piece" src="../images/checkerspiecedark.jpg">'
    }

/* ---- public class functions ----- */

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

    /* ----- private helper functions -----*/
    setLocation (colIdx, rowIdx) {
        this.loc.colIdx = colIdx;
        this.loc.rowIdx = rowIdx;
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




export { CheckersPiece, KingPiece };