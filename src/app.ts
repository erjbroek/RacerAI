import { GameLoop } from './GameLoop.js';
import Racer from './utilities/Racer.js';

const gameCanvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Racer(gameCanvas);

const gameLoop = new GameLoop(game, gameCanvas); // Pass the canvas to the GameLoop
window.addEventListener('load', () => {
  gameLoop.start();
});
