import * as THREE from 'three';
import * as lil from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const geometry = new THREE.CylinderGeometry(2, 2, 3, 10, 10, true);
// const geometry = new THREE.CylinderGeometry(2, 2, 3);
const geometry = new THREE.BoxGeometry(3, 1.8, 2)
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side : THREE.DoubleSide});

let loader = new THREE.TextureLoader();
let color = loader.load("images/paper_0025_color_1k.jpg")
let roughness = loader.load("images/roughness.jpg");
let normal = loader.load("images/normal.png")
let hight = loader.load("images/height.png")


const material = new THREE.MeshStandardMaterial({ map: color, roughnessMap: roughness, normalMap: normal })
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

let ambient = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambient)

let directional = new THREE.DirectionalLight(0xffffff, 3)
directional.position.set(2, 2, 2)
scene.add(directional)

const helper = new THREE.DirectionalLightHelper( directional, 2 );
scene.add( helper );

let point = new THREE.PointLight(0xffffff, 1, 10, 2)
point.position.set(.3,-1.34,1)
scene.add(point)

const pointLightHelper = new THREE.PointLightHelper( point,0.2 );
scene.add( pointLightHelper );

// // create a directional light with high intensity
// const highIntensityLight = new THREE.DirectionalLight(0xffffff, 2)
// highIntensityLight.position.set(10, 20, 15);
// scene.add(highIntensityLight);

// // create a directional light to simulate  sunlight
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 7.5)
// scene.add(directionalLight);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// //create a point light to simulate a light bulb
// const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
// pointLight.position.set(0, 5, 0);
// scene.add(pointLight);


// const DirectionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(DirectionalLightHelper);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
// scene.add(pointLightHelper);

// GUI Setup
const gui = new lil.GUI();
// Light Settings
const lightFolder = gui.addFolder('Light Settings');

// Ambient Light Controls
const ambientFolder = lightFolder.addFolder('Ambient Light');
ambientFolder.add(ambient, 'intensity', 0, 2).name('Intensity');
ambientFolder.addColor(ambient, 'color').name('Color');

// Directional Light Controls
const directionalFolder = lightFolder.addFolder('Directional Light');
directionalFolder.add(directional, 'intensity', 0, 5).name('Intensity');
directionalFolder.addColor(directional, 'color').name('Color');
directionalFolder.add(directional.position, 'x', -10, 10).name('Position X');
directionalFolder.add(directional.position, 'y', -10, 10).name('Position Y');
directionalFolder.add(directional.position, 'z', -10, 10).name('Position Z');

// Point Light Controls
const pointFolder = lightFolder.addFolder('Point Light');
pointFolder.add(point, 'intensity', 0, 3).name('Intensity');
pointFolder.add(point, 'distance', 0, 20).name('Distance');
pointFolder.add(point, 'decay', 0, 5).name('Decay');
pointFolder.addColor(point, 'color').name('Color');
pointFolder.add(point.position, 'x', -5, 5).name('Position X');
pointFolder.add(point.position, 'y', -5, 5).name('Position Y');
pointFolder.add(point.position, 'z', -5, 5).name('Position Z');

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
meshFolder.add(cube.position, 'x', -10, 10).name('Position X');
meshFolder.add(cube.position, 'y', -10, 10).name('Position Y');
meshFolder.add(cube.position, 'z', -10, 10).name('Position Z');
meshFolder.add(cube.scale, 'x', 0.1, 3).name('Scale X');
meshFolder.add(cube.scale, 'y', 0.1, 3).name('Scale Y');
meshFolder.add(cube.scale, 'z', 0.1, 3).name('Scale Z');
meshFolder.open();


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.dampingFactor = 0.25



function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    controls.update();
}
animate();