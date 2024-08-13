import * as THREE from "three";
import Scene from "./Scene";
import KeyListener from "../utilities/KeyListener";
export default class TestScene extends Scene {
    scene;
    camera;
    renderer;
    cube;
    speed = 0.05;
    jumpSpeed = 0;
    gravity = -0.002;
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    processInput(keyListener) {
        if (KeyListener.isKeyDown("ArrowLeft")) {
            this.cube.position.x -= this.speed;
        }
        if (KeyListener.isKeyDown("ArrowRight")) {
            this.cube.position.x += this.speed;
        }
        if (KeyListener.isKeyDown("Space") && this.cube.position.y === 0) {
            this.jumpSpeed = 0.05;
        }
    }
    update(elapsed) {
        this.cube.position.y += this.jumpSpeed;
        this.jumpSpeed += this.gravity;
        if (this.cube.position.y < 0) {
            this.cube.position.y = 0;
            this.jumpSpeed = 0;
        }
        return this;
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
//# sourceMappingURL=TestScene.js.map