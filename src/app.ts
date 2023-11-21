import Ducker from './Ducker.js';
import { GameLoop } from './GameLoop.js';
import StartingScene from './StartingScene.js';

const game = new Ducker(document.getElementById('game') as HTMLCanvasElement);

const gameLoop = new GameLoop(game);
window.addEventListener('load', () => {
  gameLoop.start();
});
