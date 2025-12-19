import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { color } from 'three/tsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const geometry = new THREE.IcosahedronGeometry(1.0, 5);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, });
const material = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, })
const mesh = new THREE.Mesh(geometry, material);

// camera.position.y = -3;
scene.add(mesh);

const wireMet = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
const wireMesh = new THREE.Mesh(geometry, wireMet);
// wireMesh.scale.setScalar(2.001);
scene.add(wireMesh);


const hemiLight = new THREE.HemisphereLight(0xffffbb,);
scene.add(hemiLight);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
// controls.autoRotateSpeed = 8.0
controls.enableZoom = true;
controls.dampingFactor = 0.01;   //control speed 



function animate(t = 0) {
    // console.log(t);
    window.requestAnimationFrame(animate)
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0);
    // mesh.rotation.x += 0.001;
    // mesh.rotation.y += 0.001;
    renderer.render(scene, camera);
    controls.update();
}
animate()