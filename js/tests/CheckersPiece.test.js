// questing: is there a more elegent way to import multiple
// functions/classes into a test module?
const PlayingPiecesClasses = require('../CheckersPiece');
const KingPiece = PlayingPiecesClasses.KingPiece;
const CheckersPiece = PlayingPiecesClasses.CheckersPiece;

// tests for the CheckersPiece class

// test for expected inputs
test ("should have index: [0,0] && player: 1", () => {
    const testPiece = new CheckersPiece (1, 0, 0);
    const expectedObj = {
        player: 1,
        location: {
            colIdx: 0,
            rowIdx: 0
        }
    }
    expect (testPiece).toMatchObject(expectedObj);
});
test ("should have index: [7,7] && player: -1", () => {
    const testObj = testHelper(-1, 7, 7);
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);
});

test ("should have index: [0,0] && player: 1", () => {
    const testPiece = new CheckersPiece (1, 0, 0);
    const expectedObj = {
        player: 1,
        location: {
            colIdx: 0,
            rowIdx: 0
        }
    }
    expect (testPiece).toMatchObject(expectedObj);
});


/* ---------- test for bad inputs inputs ----------*/

// too few inputs
test ("player and location set to null if no params", () => {
    const testObj = testHelper();
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);
});
test ("player value is 1 if passed only '1', location set as 'null'", () => {
    const testObj = testHelper (1);
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);
});
test ("set player to undefined if only 2 parameters", () => {
    let testObj = testHelper (6, 5);
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);
});

// too many inputs

// should ignore extra weird inputs and run smoothly 
test ("should get valid object on too many inputs", () => {
    let testObj = testHelper(1, 4, 5, 10, 'hello')
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);    
});
test ("trying with MANY parameters passed", () => {
    const testArray = [];
    for (let i = 0; i < 1000; i++) {
        testArray.push(i);
    }
    let testObj = testHelper(...testArray)
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);    
});

test ("passing in strings instead of integers", () => {
    // still have to decide how to handle this kind of input
    let testObj = testHelper('one', 'two', 'three')
    expect (testObj.testPiece).toMatchObject(testObj.testAgainst);    
})

// for testing how tests work
test("empty test", () => {
    expect(null).toBeNull;
    expect(true).toBe(true);
})


// called by individual tests
// takes any number of arguments, but ignores any after 3
// returns an object containing two objects, intended to be compared
// one is created using a class constructor, 
// the other created by hand to be what the constructor SHOULD return
function testHelper () {
    const testObj = {}
    testObj.testPiece = new CheckersPiece (...arguments);
    if (arguments.length === 2) {
        testObj.testAgainst = {
            player: null,
            location: {
                colIdx: arguments[0],
                rowIdx: arguments[1]
            }
        }
    } else if (arguments.length === 1) {
        testObj.testAgainst = {
            player: arguments[0],
            location: null
        }
    } else if (arguments.length === 0) {
        testObj.testAgainst = {
            player: null,
            location: null
        }
    } else {
        testObj.testAgainst = {
            player: arguments[0],
            location: {
                colIdx: arguments[1],
                rowIdx: arguments[2]
            }
        }
    }
    return testObj;
}