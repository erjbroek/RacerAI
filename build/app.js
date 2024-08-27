import { GameLoop } from './GameLoop.js';
import Racer from './utilities/Racer.js';
const gameCanvas = document.getElementById('game');
const game = new Racer(gameCanvas);
const gameLoop = new GameLoop(game, gameCanvas);
window.addEventListener('load', () => {
    gameLoop.start();
});
//# sourceMappingURL=app.js.map