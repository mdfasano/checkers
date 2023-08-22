// questing: is there a more elegent way to import multiple
// functions/classes into a test module?
const PlayingPiecesClasses = require('../CheckersPiece');
const KingPiece = PlayingPiecesClasses.KingPiece;
const CheckersPiece = PlayingPiecesClasses.CheckersPiece;

// tests for the CheckersPiece class

// test for expected inputs
test ("should have index: [0,0] && player: 1", () => {
    const testPiece = new CheckersPiece (0, 0, 1);
    expect (
        testPiece.location.colIdx === 0
    ).toBe(true);
});


/* ---------- test for bad inputs inputs ----------*/

// too few inputs
test ("owner and location set to null if no params", () => {
    let testPiece = new CheckersPiece ();
    expect (
        testPiece.player === null &&
        testPiece.location.colIdx === null &&
        testPiece.location.rowIdx === null
        ).toBe(true);
});
test ("set location to undefined if only 2 parameters", () => {
    let testPiece = new CheckersPiece (1, 1);
    expect (testPiece.player).toBe(null);
});
test ("set owner to undefined if only 2 parameters", () => {
    let testPiece = new CheckersPiece (1, 1);
    expect (testPiece.player).toBe(null);
});
// too many inputs
// should ignore extra inputs and run smoothly 
test ("should get back a valid object on too many inputs", () => {

});
test ("return -1 if ----- is given", () => {

});



test("empty test", () => expect(true).toBe(true));