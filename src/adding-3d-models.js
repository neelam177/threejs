import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

// Renderer setup
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// HDRI Environment Loading
const rgbeLoader = new RGBELoader();

// Create a simple procedural HDRI-like environment since we don't have external files
function createProceduralHDRI() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98D8E8'); // Light blue
    gradient.addColorStop(1, '#F0F8FF'); // Almost white
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add some clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size * 0.6;
        const radius = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
}

const envTexture = createProceduralHDRI();
scene.environment = envTexture;
scene.background = envTexture;

// Create some objects to showcase the HDRI lighting
const objects = [];

// Metallic sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.1
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-3, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
objects.push(sphere);

// Rough cube
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    metalness: 0.2,
    roughness: 0.8
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);
objects.push(cube);

// Glossy torus
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 0.7,
    roughness: 0.2
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(3, 0, 0);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);
objects.push(torus);

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.1,
    roughness: 0.9
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

// Additional directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.minDistance = 3;
controls.maxDistance = 20;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate objects slightly for dynamic reflections
    objects.forEach((obj, index) => {
        obj.rotation.y += 0.005 * (index + 1);
        obj.rotation.x += 0.002 * (index + 1);
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();