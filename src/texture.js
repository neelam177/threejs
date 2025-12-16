import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

let loader = new THREE.TextureLoader();
let color = loader.load("images/color.jpg")
let roughness = loader.load("images/roughness.jpg");
let normal = loader.load("images/normal.png")
let hight = loader.load("images/height.png")


const geometry = new THREE.BoxGeometry(3, 1.8, 2);
const material = new THREE.MeshStandardMaterial({ map: color, roughnessMap: roughness, normalMap: normal});
const circle = new THREE.Mesh(geometry, material);
scene.add(circle)

const directionalLight = new THREE.DirectionalLight(0xffff00, 5)
directionalLight.position.set(5, 10, 7.4)
scene.add(directionalLight);

let ambient = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambient);


// DirectionalLightHelper needs the actual light object, not a color
const helper = new THREE.DirectionalLightHelper(directionalLight, 10);
scene.add(helper);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
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
