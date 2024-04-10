import Scene from './Scene.js';
import CanvasUtil from '../utilities/CanvasUtil.js';
import SelectAngle from './SelectAngle.js';
import StartButton from '../background items/StartButton.js';
export default class StartingScene extends Scene {
    logo;
    startButton;
    title;
    constructor() {
        super();
        this.logo = CanvasUtil.loadNewImage('./assets/introSceneBackground.png');
        this.title = CanvasUtil.loadNewImage('./assets/mainTitle.png');
        this.startButton = new StartButton();
    }
    processInput(keyListener, mouseListener) {
        this.startButton.processInput(keyListener, mouseListener);
    }
    update() {
        if (this.startButton.getReadyGame()) {
            return new SelectAngle();
        }
        return null;
    }
    render(canvas) {
        CanvasUtil.drawImage(canvas, this.logo, 0, 0, canvas.width, canvas.height, 0);
        CanvasUtil.drawImage(canvas, this.title, canvas.width / 2, canvas.height / 23, this.title.width / 2.2, this.title.height / 2.2, 0);
        this.startButton.render(canvas);
        CanvasUtil.writeText(canvas, 'Made by: Erik van den Broek', canvas.width / 1.4, canvas.height / 1.6, 'center', 'arial', 15, 'gray');
    }
}
//# sourceMappingURL=StartingScene.js.map