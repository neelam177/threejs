import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as lil from 'lil-gui';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// Simple material without external textures
const geometry = new THREE.BoxGeometry(3, 1.8, 2);
const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 0.5,
    metalness: 0.3
});
const circle = new THREE.Mesh(geometry, material);
scene.add(circle);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight);

let ambient = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambient);

let point = new THREE.PointLight(0xffffff, 1, 10, 2)
point.position.set(.3, -1.34,1)
scene.add(point)

const pointLightHelper = new THREE.PointLightHelper(point, 0.2);
scene.add(pointLightHelper);



// DirectionalLightHelper needs the actual light object, not a color
const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(helper);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const gui = new lil.GUI();
// Light Settings
const lightFolder = gui.addFolder('Light Settings');

// Ambient Light Controls
const ambientFolder = lightFolder.addFolder('Ambient Light');
ambientFolder.add(ambient, 'intensity', 0, 2).name('Intensity');
ambientFolder.addColor(ambient, 'color').name('Color');

// Directional Light Controls
const directionalFolder = lightFolder.addFolder('Directional Light');
directionalFolder.add(directionalLight, 'intensity', 0, 5).name('Intensity');
directionalFolder.addColor(directionalLight, 'color').name('Color');
directionalFolder.add(directionalLight.position, 'x', -10, 10).name('Position X');
directionalFolder.add(directionalLight.position, 'y', -10, 10).name('Position Y');
directionalFolder.add(directionalLight.position, 'z', -10, 10).name('Position Z');

lightFolder.open();

// Material Settings
const materialFolder = gui.addFolder('Material Settings');
materialFolder.add(material, 'roughness', 0, 1).name('Roughness');
materialFolder.add(material, 'metalness', 0, 1).name('Metalness');
materialFolder.addColor(material, 'color').name('Color');
materialFolder.add(material, 'wireframe').name('Wireframe');
materialFolder.open();

// Mesh Settings
const meshFolder = gui.addFolder('Mesh Settings');
meshFolder.add(circle.position, 'x', -10, 10).name('Position X');
meshFolder.add(circle.position, 'y', -10, 10).name('Position Y');
meshFolder.add(circle.position, 'z', -10, 10).name('Position Z');
meshFolder.add(circle.scale, 'x', 0.1, 3).name('Scale X');
meshFolder.add(circle.scale, 'y', 0.1, 3).name('Scale Y');
meshFolder.add(circle.scale, 'z', 0.1, 3).name('Scale Z');
meshFolder.open();



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.dampingFactor = 0.05;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// const clock = new THREE.Clock();

function animate() {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera);
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    controls.update();

}
animate();
