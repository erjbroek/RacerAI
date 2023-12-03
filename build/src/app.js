import Ducker from './Ducker.js';
import { GameLoop } from './GameLoop.js';
const game = new Ducker(document.getElementById('game'));
const gameLoop = new GameLoop(game);
window.addEventListener('load', () => {
    gameLoop.start();
});
//# sourceMappingURL=app.js.map