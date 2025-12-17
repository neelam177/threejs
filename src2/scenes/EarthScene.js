import * as THREE from 'three';
import getStarfied from "/starts/getStarfield.js";

export function createEarthScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const loader = new THREE.TextureLoader();

    const earthTexture = loader.load("/textures/00_earthmap1k.jpg");
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture
    });

    const earthMesh = new THREE.Mesh(geometry, earthMaterial);
    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
        map: loader.load("/textures/03_earthlights1k.jpg"),
    });

    const lightMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightMesh);

    const stars = new getStarfied({ numStars: 2000 });
    scene.add(stars);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    // Animation function for this scene
    const animate = () => {
        earthMesh.rotation.y += 0.002;
        lightMesh.rotation.y += 0.002;
    };

    return {
        scene,
        camera,
        animate,
        meshes: { earthMesh, lightMesh }
    };
}