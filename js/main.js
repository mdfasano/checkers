/* ---- import classes ---- */
import { CheckersGame } from "./CheckersGame.js";
import { CheckersPiece } from "./CheckersGame.js";
import { KingPiece  } from "./CheckersGame.js";
import { BoardTile } from "./CheckersGame.js";

/* ---- state variables ---- */
let game;

/* ---- cached dom elements ---*/
const boardEl = document.getElementById('game-board');
const messageEl = document.getElementById('message-area');
const buttonEl = document.getElementById('button-area');

/* --- functions --- */
initialize ();

function initialize () {
    game = new CheckersGame(boardEl, messageEl);
    game.play();

}