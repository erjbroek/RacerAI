import { GameLoop } from './utilities/GameLoop.js';
import Racer from './utilities/Racer.js';

const game = new Racer(document.getElementById('game') as HTMLCanvasElement);

const gameLoop = new GameLoop(game);
window.addEventListener('load', () => {
  gameLoop.start();
});
