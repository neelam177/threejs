import * as THREE from 'three';

export function createGeometricScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1.0, 2);
    const geoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        flatShading: true 
    });
    const geoMesh = new THREE.Mesh(geometry, geoMaterial);
    scene.add(geoMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true 
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    scene.add(wireMesh);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0xaa5500);
    scene.add(hemiLight);

    // Animation function for this scene
    const animate = () => {
        geoMesh.rotation.y += 0.001;
    };

    return {
        scene,
        camera,
        animate,
        meshes: { geoMesh, wireMesh }
    };
}