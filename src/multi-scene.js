import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Main setup
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Scene storage
const scenes = [];
let currentSceneIndex = 0;

// Create Scene 1: Floating Cubes Paradise
function createScene1() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    const cubes = [];
    for (let i = 0; i < 15; i++) {
        const geometry = new THREE.BoxGeometry(
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5
        );
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            metalness: 0.3,
            roughness: 0.4
        });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20
        );
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        
        scene.add(cube);
        cubes.push(cube);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    return { scene, objects: cubes, name: "Floating Cubes Paradise" };
}

// Create Scene 2: Neon City
function createScene2() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011); // Dark blue
    scene.fog = new THREE.Fog(0x000011, 10, 50);
    
    const buildings = [];
    for (let i = 0; i < 20; i++) {
        const height = Math.random() * 15 + 5;
        const geometry = new THREE.BoxGeometry(2, height, 2);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1, 0.5),
            emissive: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1, 0.2),
            metalness: 0.8,
            roughness: 0.2
        });
        const building = new THREE.Mesh(geometry, material);
        
        building.position.set(
            (Math.random() - 0.5) * 40,
            height / 2,
            (Math.random() - 0.5) * 40
        );
        
        scene.add(building);
        buildings.push(building);
    }
    
    // Neon lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xff00ff, 2, 30);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00ffff, 2, 30);
    pointLight2.position.set(-10, 10, -10);
    scene.add(pointLight2);
    
    return { scene, objects: buildings, name: "Neon City" };
}

// Create Scene 3: Forest of Spheres
function createScene3() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x228B22); // Forest green
    
    const spheres = [];
    for (let i = 0; i < 25; i++) {
        const radius = Math.random() * 1.5 + 0.5;
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.3 + Math.random() * 0.2, 0.8, 0.5),
            metalness: 0.1,
            roughness: 0.8
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(
            (Math.random() - 0.5) * 25,
            radius,
            (Math.random() - 0.5) * 25
        );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        scene.add(sphere);
        spheres.push(sphere);
    }
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3d5a3d,
        roughness: 0.9 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    return { scene, objects: spheres, name: "Forest of Spheres" };
}

// Create Scene 4: Space Station
function createScene4() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black space
    
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    const spaceObjects = [];
    
    // Central station
    const stationGeometry = new THREE.CylinderGeometry(3, 3, 8, 8);
    const stationMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.1
    });
    const station = new THREE.Mesh(stationGeometry, stationMaterial);
    scene.add(station);
    spaceObjects.push(station);
    
    // Orbiting modules
    for (let i = 0; i < 6; i++) {
        const moduleGeometry = new THREE.BoxGeometry(1, 1, 3);
        const moduleMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169E1,
            metalness: 0.7,
            roughness: 0.3
        });
        const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
        
        const angle = (i / 6) * Math.PI * 2;
        module.position.set(
            Math.cos(angle) * 8,
            Math.sin(i) * 2,
            Math.sin(angle) * 8
        );
        
        scene.add(module);
        spaceObjects.push(module);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    
    return { scene, objects: spaceObjects, name: "Space Station", stars };
}

// Initialize all scenes
scenes.push(createScene1());
scenes.push(createScene2());
scenes.push(createScene3());
scenes.push(createScene4());

// Set initial camera position
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Scene switching function
function switchScene(index) {
    currentSceneIndex = index;
    console.log(`Switched to: ${scenes[currentSceneIndex].name}`);
    
    // Reset camera position for each scene
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    controls.reset();
}

// Auto scene switching (like TV channels)
let autoSwitchTimer = 0;
const autoSwitchInterval = 8000; // 8 seconds

// Keyboard controls
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case '1':
            switchScene(0);
            break;
        case '2':
            switchScene(1);
            break;
        case '3':
            switchScene(2);
            break;
        case '4':
            switchScene(3);
            break;
        case ' ': // Spacebar for next scene
            switchScene((currentSceneIndex + 1) % scenes.length);
            break;
    }
});

// Create UI
const ui = document.createElement('div');
ui.style.position = 'absolute';
ui.style.top = '20px';
ui.style.left = '20px';
ui.style.color = 'white';
ui.style.fontFamily = 'Arial, sans-serif';
ui.style.fontSize = '16px';
ui.style.background = 'rgba(0,0,0,0.7)';
ui.style.padding = '15px';
ui.style.borderRadius = '10px';
ui.innerHTML = `
    <h3>🎬 Multi-Scene TV</h3>
    <p>Current: <span id="sceneName">${scenes[0].name}</span></p>
    <p>Controls:</p>
    <p>• Press 1-4 for scenes</p>
    <p>• Spacebar for next</p>
    <p>• Auto-switch: 8s</p>
`;
document.body.appendChild(ui);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const currentScene = scenes[currentSceneIndex];
    const deltaTime = 16; // Approximate 60fps
    
    // Auto scene switching
    autoSwitchTimer += deltaTime;
    if (autoSwitchTimer >= autoSwitchInterval) {
        switchScene((currentSceneIndex + 1) % scenes.length);
        autoSwitchTimer = 0;
        document.getElementById('sceneName').textContent = scenes[currentSceneIndex].name;
    }
    
    // Animate objects in current scene
    if (currentScene.objects) {
        currentScene.objects.forEach((obj, index) => {
            obj.rotation.y += 0.01 * (index % 3 + 1);
            obj.rotation.x += 0.005 * (index % 2 + 1);
            
            // Special animations per scene
            if (currentSceneIndex === 0) { // Floating cubes
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
            } else if (currentSceneIndex === 3 && currentScene.stars) { // Space station
                currentScene.stars.rotation.y += 0.0005;
            }
        });
    }
    
    controls.update();
    renderer.render(currentScene.scene, camera);
}

animate();

console.log("🎬 Multi-Scene TV Started!");
console.log("Press 1-4 to switch scenes or Spacebar for next scene");