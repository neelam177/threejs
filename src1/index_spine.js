import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from "./spline.js";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000,0.3);
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;


// Create a line geometry from spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({color: 0xff0000});
const line = new THREE.Line(geometry, material);
// scene.add(line);

// create a tube geometry from the spine
const tubeGeo = new THREE.TubeGeometry( spline, 222, 0.65, 16, true );
const tubeMaterial = new THREE.MeshBasicMaterial({
    color:0x0099ff,
    side:THREE.DoubleSide,
    wireframe:true
})
const tubeMesh = new THREE.Mesh(tubeGeo,tubeMaterial);
scene.add(tubeMesh);



// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
// scene.add(ambientLight);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

// create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

function updateCamera(t) {
  const time = t * 0.1;
  const looptime = 10 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 8.0
// controls.enableZoom = true;
controls.dampingFactor = 0.03;   //control speed 

function animate(t=0) {
    window.requestAnimationFrame(animate);
    updateCamera(t);
    // Rotate the line
    line.rotation.y += 0.002;
    
    controls.update();
    renderer.render(scene, camera);
}
animate()