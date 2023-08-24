const CheckersGame = require ('../CheckersGame');


test ("check if initialized properly", () => {
    const myGame = new CheckersGame (1, 2)
    expect (myGame.boardElement === 1).toBe(true)
    expect (myGame.messageElement === 2).toBe(true)
})