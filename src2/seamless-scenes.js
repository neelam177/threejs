import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfied from "/starts/getStarfield.js";
import { getFresnelMat } from "/starts/getFresnelMat.js";

// Create multiple scenes
const scenes = [];
const cameras = [];
let currentSceneIndex = 0;
let isTransitioning = false;
let transitionProgress = 0;

// Scene 1: Earth Scene
const earthScene = new THREE.Scene();
const earthCamera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
earthCamera.position.z = 5;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
earthScene.add(earthGroup);

const geometry1 = new THREE.IcosahedronGeometry(1, 12);
const loader = new THREE.TextureLoader();

const earthTexture = loader.load("/textures/00_earthmap1k.jpg");
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earthMesh = new THREE.Mesh(geometry1, earthMaterial);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("/textures/03_earthlights1k.jpg"),
});

const lightMesh = new THREE.Mesh(geometry1, lightsMat);
earthGroup.add(lightMesh);

const stars = new getStarfied({ numStars: 2000 });
earthScene.add(stars);

const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.6);
earthScene.add(ambientLight1);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
earthScene.add(sunLight);

// Scene 2: Geometric Scene
const geoScene = new THREE.Scene();
const geoCamera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
geoCamera.position.z = 5;

const geometry2 = new THREE.IcosahedronGeometry(1.0, 2);
const geoMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});
const geoMesh = new THREE.Mesh(geometry2, geoMaterial);
geoScene.add(geoMesh);

const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geometry2, wireMaterial);
geoScene.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0xffffbb, 0xaa5500);
geoScene.add(hemiLight);

// Add scenes and cameras to arrays
scenes.push(earthScene, geoScene);
cameras.push(earthCamera, geoCamera);

// Renderer setup
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false; // Important for scene blending

// Controls for current camera
let controls = new OrbitControls(cameras[currentSceneIndex], renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.dampingFactor = 0.01;

// Transition parameters
const transitionDuration = 1000;
let transitionStartTime = 0;

// Auto transition timer
let lastTransitionTime = Date.now();
const autoTransitionInterval = 1000;

function startTransition() {
    if (isTransitioning) return;

    isTransitioning = true;
    transitionStartTime = Date.now();

    // Switch to next scene
    const nextSceneIndex = (currentSceneIndex + 1) % scenes.length;

    // Update controls to new camera
    controls.dispose();
    controls = new OrbitControls(cameras[nextSceneIndex], renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.dampingFactor = 0.01;

    console.log(`Transitioning from scene ${currentSceneIndex + 1} to scene ${nextSceneIndex + 1}`);
}

function updateTransition() {
    if (!isTransitioning) return;

    const elapsed = Date.now() - transitionStartTime;
    transitionProgress = Math.min(elapsed / transitionDuration, 1);

    // Smooth easing function
    const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easedProgress = easeInOut(transitionProgress);

    if (transitionProgress >= 1) {
        // Transition complete
        isTransitioning = false;
        currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
        transitionProgress = 0;
        lastTransitionTime = Date.now();
    }
}

function render() {
    renderer.clear();

    if (isTransitioning) {
        // Render both scenes with opacity blending
        const currentScene = scenes[currentSceneIndex];
        const nextScene = scenes[(currentSceneIndex + 1) % scenes.length];
        const currentCamera = cameras[currentSceneIndex];
        const nextCamera = cameras[(currentSceneIndex + 1) % cameras.length];

        // Render current scene with fading opacity
        renderer.render(currentScene, currentCamera);

        // Render next scene with increasing opacity
        renderer.clearDepth();

        // Create fade effect by adjusting scene opacity
        nextScene.traverse((child) => {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.transparent = true;
                        mat.opacity = transitionProgress;
                    });
                } else {
                    child.material.transparent = true;
                    child.material.opacity = transitionProgress;
                }
            }
        });

        renderer.render(nextScene, nextCamera);

        // // Reset opacity after rendering
        // nextScene.traverse((child) => {
        //     if (child.material) {
        //         if (Array.isArray(child.material)) {
        //             child.material.forEach(mat => {
        //                 mat.transparent = false;
        //                 mat.opacity = 0;
        //             });
        //         } else {
        //             child.material.transparent = false;
        //             child.material.opacity = 1;
        //         }
        //     }
        // });
    } else {
        // Render current scene normally
        renderer.render(scenes[currentSceneIndex], cameras[currentSceneIndex]);
    }
}

function animate() {
    window.requestAnimationFrame(animate);

    // Update scene-specific animations
    earthMesh.rotation.y += 0.002;
    lightMesh.rotation.y += 0.002;
    geoMesh.rotation.y += 0.002;

    // Auto transition check
    if (!isTransitioning && Date.now() - lastTransitionTime > autoTransitionInterval) {
        startTransition();
    }

    // Update transition
    updateTransition();

    // Update controls
    controls.update();

    // Render
    render();
}

// Manual transition on spacebar
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        startTransition();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    cameras.forEach(camera => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    renderer.setSize(width, height);
});

animate();