import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // smooth animate
controls.autoRotate = true;
controls.autoRotateSpeed = 12.0;
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
