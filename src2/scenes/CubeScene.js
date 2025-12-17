import * as THREE from 'three';

export function createCubeScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Create multiple colored cubes
    const cubes = [];
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ color: colors[i] });
        const cube = new THREE.Mesh(geometry, material);
        
        // Position cubes in a circle
        const angle = (i / 5) * Math.PI * 2;
        cube.position.x = Math.cos(angle) * 1.5;
        cube.position.y = Math.sin(angle) * 1.5;
        
        cubes.push(cube);
        scene.add(cube);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation function for this scene
    const animate = () => {
        cubes.forEach((cube, index) => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            // Make cubes orbit around center
            const time = Date.now() * 0.001;
            const angle = (index / 5) * Math.PI * 2 + time;
            cube.position.x = Math.cos(angle) * 1.5;
            cube.position.y = Math.sin(angle) * 1.5;
        });
    };

    return {
        scene,
        camera,
        animate,
        meshes: { cubes }
    };
}