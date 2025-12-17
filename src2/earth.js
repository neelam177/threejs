import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfied from "/starts/getStarfield.js";
import { getFresnelMat } from "/starts/getFresnelMat.js"
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const geometry = new THREE.IcosahedronGeometry(1, 12);
const loader = new THREE.TextureLoader();

// Load the earth texture
const earthTexture = loader.load("/textures/00_earthmap1k.jpg");
const material = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/03_earthlights1k.jpg"),
//   blending: THREE.AdditiveBlending,
});

// const fresnelMat = getFresnelMat();
// const glowMesh = new THREE.Mesh(geometry, fresnelMat);
// glowMesh.scale.setScalar(1.01);
// earthGroup.add(glowMesh);

const lightMesh = new THREE.Mesh(geometry,lightsMat);
earthGroup.add(lightMesh)

const stars = new getStarfied({ numStars: 2000 });
scene.add(stars);

// Add proper lighting for MeshStandardMaterial
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff,);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 8.0
controls.enableZoom = true;
controls.dampingFactor = 0.01;   //control speed 



function animate() {
    window.requestAnimationFrame(animate);

    // Rotate the earth
    earthMesh.rotation.y += 0.002;
    lightMesh.rotation.y += 0.002;
    //  glowMesh.rotation.y += 0.002;
    controls.update();
    renderer.render(scene, camera);
}
animate()