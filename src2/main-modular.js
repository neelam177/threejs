import SceneManager from './SceneManager.js';
import { createEarthScene } from './scenes/EarthScene.js';
import { createGeometricScene } from './scenes/GeometricScene.js';
import { createCubeScene } from './scenes/CubeScene.js';

// Initialize Scene Manager
const canvas = document.querySelector("#canvas");
const sceneManager = new SceneManager(canvas);

// Scroll-based scene transition
let currentSceneIndex = 0;
let targetSceneIndex = 0;
const scrollSensitivity = 0.001;

// Add scroll event listener
const handleScroll = (event) => {
    event.preventDefault(); // Prevent actual scrolling
    
    // Get scroll delta
    const delta = event.deltaY || event.detail || event.wheelDelta;
    
    if (delta > 0) {
        // Scroll down - next scene
        targetSceneIndex = Math.min(sceneManager.scenes.length - 1, targetSceneIndex + 1);
    } else {
        // Scroll up - previous scene
        targetSceneIndex = Math.max(0, targetSceneIndex - 1);
    }
    
    // Trigger transition if scene changed
    if (targetSceneIndex !== currentSceneIndex) {
        sceneManager.currentSceneIndex = targetSceneIndex;
        sceneManager.startTransition();
        currentSceneIndex = targetSceneIndex;
        
        console.log(`Scrolled to scene ${targetSceneIndex + 1}`);
    }
};

// Add event listeners for different scroll events
window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('DOMMouseScroll', handleScroll, { passive: false }); // Firefox

// Create and add all scenes
const geoScene = createGeometricScene();
const earthScene = createEarthScene();
const cubeScene = createCubeScene();

sceneManager.addScene(geoScene);
sceneManager.addScene(earthScene);
sceneManager.addScene(cubeScene);

// Update scene indices after adding scenes
currentSceneIndex = sceneManager.currentSceneIndex;
targetSceneIndex = currentSceneIndex;

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

// Optional: Add keyboard controls for manual scene switching
window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowRight' || event.code === 'Space') {
        event.preventDefault();
        targetSceneIndex = Math.min(sceneManager.scenes.length - 1, targetSceneIndex + 1);
        if (targetSceneIndex !== currentSceneIndex) {
            sceneManager.currentSceneIndex = targetSceneIndex;
            sceneManager.startTransition();
            currentSceneIndex = targetSceneIndex;
            console.log(`Keyboard: Switched to scene ${targetSceneIndex + 1}`);
        }
    } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        targetSceneIndex = Math.max(0, targetSceneIndex - 1);
        if (targetSceneIndex !== currentSceneIndex) {
            sceneManager.currentSceneIndex = targetSceneIndex;
            sceneManager.startTransition();
            currentSceneIndex = targetSceneIndex;
            console.log(`Keyboard: Switched to scene ${targetSceneIndex + 1}`);
        }
    }
});

// Optional: Add more scenes dynamically
// const newScene = createAnotherScene();
// sceneManager.addScene(newScene);