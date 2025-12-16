// Three.js Learning Examples - Step by Step
// आप इन examples को एक-एक करके try कर सकते हैं

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Example selector
let currentExample = 0;
const examples = [];

// Setup
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Example 1: Basic Rotating Cube (Beginner)
function createExample1() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        wireframe: false 
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    return {
        scene,
        animate: () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        },
        name: "1. Basic Rotating Cube",
        description: "सबसे basic example - cube को rotate करना"
    };
}

// Example 2: Textured Cube with Lighting (Beginner+)
function createExample2() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    // Create simple texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Draw checkerboard pattern
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            ctx.fillStyle = (x + y) % 2 ? '#ff6b6b' : '#4ecdc4';
            ctx.fillRect(x * 32, y * 32, 32, 32);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    camera.position.set(3, 3, 3);
    
    return {
        scene,
        animate: () => {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
        },
        name: "2. Textured Cube with Lighting",
        description: "Texture और lighting के साथ cube"
    };
}

// Example 3: Solar System (Intermediate)
function createExample3() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    // Sun
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Moon
    const moonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);
    
    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 500; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    camera.position.set(8, 5, 8);
    
    let time = 0;
    
    return {
        scene,
        animate: () => {
            time += 0.01;
            
            // Sun rotation
            sun.rotation.y += 0.005;
            
            // Earth orbit around sun
            earth.position.x = Math.cos(time) * 4;
            earth.position.z = Math.sin(time) * 4;
            earth.rotation.y += 0.02;
            
            // Moon orbit around earth
            moon.position.x = earth.position.x + Math.cos(time * 8) * 1;
            moon.position.z = earth.position.z + Math.sin(time * 8) * 1;
            
            // Stars rotation
            stars.rotation.y += 0.0002;
        },
        name: "3. Solar System",
        description: "Earth और Moon का Sun के around orbit"
    };
}

// Example 4: Particle Rain (Intermediate+)
function createExample4() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001122);
    scene.fog = new THREE.Fog(0x001122, 10, 50);
    
    // Create rain particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;     // x
        positions[i * 3 + 1] = Math.random() * 50;         // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
        
        velocities.push(Math.random() * 0.1 + 0.05); // fall speed
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const rain = new THREE.Points(particles, particleMaterial);
    scene.add(rain);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    scene.add(ground);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x88ccff, 1, 30);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    
    camera.position.set(10, 5, 10);
    
    return {
        scene,
        animate: () => {
            const positions = rain.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                // Move particles down
                positions[i * 3 + 1] -= velocities[i];
                
                // Reset particle if it goes below ground
                if (positions[i * 3 + 1] < -5) {
                    positions[i * 3 + 1] = 25;
                    positions[i * 3] = (Math.random() - 0.5) * 50;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
                }
            }
            
            rain.geometry.attributes.position.needsUpdate = true;
        },
        name: "4. Particle Rain",
        description: "Animated rain particles with fog effect"
    };
}

// Initialize examples
examples.push(createExample1());
examples.push(createExample2());
examples.push(createExample3());
examples.push(createExample4());

// UI
const ui = document.createElement('div');
ui.style.position = 'absolute';
ui.style.top = '20px';
ui.style.left = '20px';
ui.style.color = 'white';
ui.style.fontFamily = 'Arial, sans-serif';
ui.style.fontSize = '14px';
ui.style.background = 'rgba(0,0,0,0.8)';
ui.style.padding = '15px';
ui.style.borderRadius = '10px';
ui.style.maxWidth = '300px';
document.body.appendChild(ui);

function updateUI() {
    const current = examples[currentExample];
    ui.innerHTML = `
        <h3>📚 Three.js Learning Examples</h3>
        <p><strong>${current.name}</strong></p>
        <p><em>${current.description}</em></p>
        <hr>
        <p>Controls:</p>
        <p>• Press 1-4 for examples</p>
        <p>• Arrow keys: ← →</p>
        <p>• Mouse: Orbit camera</p>
        <hr>
        <p>Example ${currentExample + 1} of ${examples.length}</p>
    `;
}

// Controls
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case '1':
            currentExample = 0;
            updateUI();
            break;
        case '2':
            currentExample = 1;
            updateUI();
            break;
        case '3':
            currentExample = 2;
            updateUI();
            break;
        case '4':
            currentExample = 3;
            updateUI();
            break;
        case 'ArrowLeft':
            currentExample = (currentExample - 1 + examples.length) % examples.length;
            updateUI();
            break;
        case 'ArrowRight':
            currentExample = (currentExample + 1) % examples.length;
            updateUI();
            break;
    }
});

// Initialize
updateUI();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const current = examples[currentExample];
    if (current.animate) {
        current.animate();
    }
    
    controls.update();
    renderer.render(current.scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

console.log("📚 Three.js Learning Examples loaded!");
console.log("Press 1-4 or use arrow keys to switch examples");