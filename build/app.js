import Ducker from './utilities/Ducker.js';
import { GameLoop } from './utilities/GameLoop.js';
const game = new Ducker(document.getElementById('game'));
const gameLoop = new GameLoop(game);
window.addEventListener('load', () => {
    gameLoop.start();
});
//# sourceMappingURL=app.js.map