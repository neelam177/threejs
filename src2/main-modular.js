import SceneManager from './SceneManager.js';
import { createEarthScene } from './scenes/EarthScene.js';
import { createGeometricScene } from './scenes/GeometricScene.js';
import { createCubeScene } from './scenes/CubeScene.js';

// Initialize Scene Manager
const canvas = document.querySelector("#canvas");
const sceneManager = new SceneManager(canvas);

// Create and add all scenes
const geoScene = createGeometricScene();
const earthScene = createEarthScene();
const cubeScene = createCubeScene();

sceneManager.addScene(geoScene);
sceneManager.addScene(earthScene);
sceneManager.addScene(cubeScene);

// Store scene animations for easy access
const sceneAnimations = [
    geoScene.animate,
    earthScene.animate,
    cubeScene.animate
];

// Main animation loop
function animate() {
    window.requestAnimationFrame(animate);

    // Run animations for all scenes (they stay alive)
    sceneAnimations.forEach(sceneAnimate => sceneAnimate());

    // Update scene manager (handles transitions and rendering)
    sceneManager.update();
}

animate();

// Optional: Add more scenes dynamically
// const newScene = createAnotherScene();
// sceneManager.addScene(newScene);