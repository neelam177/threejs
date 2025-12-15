import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';

const scene = new THREE.scene();
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, Wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const canvas = document.querySelector("#canvas")
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth,window.innerHeight);