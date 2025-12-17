import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// Create 7 different objects
const objects = [];

// Object 1 - Green Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
objects.push(cube);

// Object 2 - Red Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
objects.push(sphere);

// Object 3 - Blue Cylinder
const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
objects.push(cylinder);

// Object 4 - Yellow Cone
const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1, 32),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
objects.push(cone);

// Object 5 - Purple Torus
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
objects.push(torus);

// Object 6 - Orange Octahedron
const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7),
    new THREE.MeshBasicMaterial({ color: 0xff8800 })
);
objects.push(octahedron);

// Object 7 - Cyan Dodecahedron
const dodecahedron = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.6),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
);
objects.push(dodecahedron);

// Add all objects to scene but make them invisible initially
objects.forEach(obj => {
    obj.visible = false;
    scene.add(obj);
});

// Show first object
objects[0].visible = true;
let currentObjectIndex = 0;


const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // smooth animate
controls.enableZoom = true;
controls.dampingFactor = 0.04;

// Zoom thresholds for switching objects
const zoomThresholds = [5, 3, 2, 1.5, 1, 0.7, 0.5];

const clock = new THREE.Clock();

// Function to update visible object based on camera distance
function updateVisibleObject() {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));

    let newObjectIndex = 0;
    for (let i = 0; i < zoomThresholds.length; i++) {
        if (distance <= zoomThresholds[i]) {
            newObjectIndex = i;
        }
    }

    // If object changed, update visibility
    if (newObjectIndex !== currentObjectIndex) {
        objects[currentObjectIndex].visible = false;
        objects[newObjectIndex].visible = true;
        currentObjectIndex = newObjectIndex;

        console.log(`Switched to object ${newObjectIndex + 1} at distance ${distance.toFixed(2)}`);
    }
}

function animate() {
    window.requestAnimationFrame(animate);

    controls.update();
    updateVisibleObject();

    // Rotate current visible object
    if (objects[currentObjectIndex]) {
        objects[currentObjectIndex].rotation.y = clock.getElapsedTime();
        objects[currentObjectIndex].rotation.x = clock.getElapsedTime() * 0.5;
    }

    renderer.render(scene, camera);
}

animate();
