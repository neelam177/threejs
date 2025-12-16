import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
// camera.position.x = 1;
// camera.position.y = 2;
camera.position.y = -3;
scene.add(mesh);


const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 8.0
controls.enableZoom = true;
controls.dampingFactor = 0.01;   //control speed 



function animate() {
    window.requestAnimationFrame(animate)
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
    controls.update();
}
animate()