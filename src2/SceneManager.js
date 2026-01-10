import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class SceneManager {
    constructor(canvas) {
        this.scenes = [];
        this.cameras = [];
        this.currentSceneIndex = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionDuration = 1500; // Smoother, faster transition
        this.autoTransitionInterval = 2000; // Longer interval between auto transitions
        this.lastTransitionTime = Date.now();
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = true;
        
        this.setupEventListeners();
    }
    
    addScene(sceneData) {
        this.scenes.push(sceneData.scene);
        this.cameras.push(sceneData.camera);
        
        // Setup controls for first scene
        if (this.scenes.length === 1) {
            this.controls = new OrbitControls(this.cameras[0], this.renderer.domElement);
            this.setupControls();
        }
        
        return this.scenes.length - 1; // Return scene index
    }
    
    setupControls() {
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
        this.controls.dampingFactor = 0.01;
    }
    
    startTransition() {
        if (this.isTransitioning || this.scenes.length < 2) return;
        
        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        
        const nextSceneIndex = (this.currentSceneIndex + 1) % this.scenes.length;
        
        // Update controls to new camera
        this.controls.dispose();
        this.controls = new OrbitControls(this.cameras[nextSceneIndex], this.renderer.domElement);
        this.setupControls();
        
        console.log(`Transitioning from scene ${this.currentSceneIndex + 1} to scene ${nextSceneIndex + 1}`);
    }
    
    updateTransition() {
        if (!this.isTransitioning) return;
        
        const elapsed = Date.now() - this.transitionStartTime;
        this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1);
        
        // Smoother easing function for seamless transitions
        const easeInOutCubic = t => t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        this.transitionProgress = easeInOutCubic(this.transitionProgress);
        
        if (elapsed >= this.transitionDuration) {
            this.isTransitioning = false;
            this.currentSceneIndex = (this.currentSceneIndex + 1) % this.scenes.length;
            this.transitionProgress = 0;
            this.lastTransitionTime = Date.now();
        }
    }
    
    render() {
        this.renderer.clear();
        
        if (this.isTransitioning) {
            const currentScene = this.scenes[this.currentSceneIndex];
            const nextScene = this.scenes[(this.currentSceneIndex + 1) % this.scenes.length];
            const currentCamera = this.cameras[this.currentSceneIndex];
            const nextCamera = this.cameras[(this.currentSceneIndex + 1) % this.cameras.length];
            
            // Render current scene
            this.renderer.render(currentScene, currentCamera);
            
            // Render next scene with opacity
            this.renderer.clearDepth();
            this.setSceneOpacity(nextScene, this.transitionProgress);
            this.renderer.render(nextScene, nextCamera);
            this.setSceneOpacity(nextScene, 1); // Reset opacity
        } else {
            this.renderer.render(this.scenes[this.currentSceneIndex], this.cameras[this.currentSceneIndex]);
        }
    }
    
    setSceneOpacity(scene, opacity) {
        scene.traverse((child) => {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.transparent = true; // Always transparent for smooth blending
                        mat.opacity = opacity;
                        mat.needsUpdate = true; // Force material update
                    });
                } else {
                    child.material.transparent = true; // Always transparent for smooth blending
                    child.material.opacity = opacity;
                    child.material.needsUpdate = true; // Force material update
                }
            }
        });
    }
    
    update() {
        // Auto transition check
        if (!this.isTransitioning && this.scenes.length > 1 && 
            Date.now() - this.lastTransitionTime > this.autoTransitionInterval) {
            this.startTransition();
        }
        
        this.updateTransition();
        this.controls.update();
        this.render();
    } 
    
    setupEventListeners() {
        // Manual transition on spacebar
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.startTransition();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.cameras.forEach(camera => {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });
            
            this.renderer.setSize(width, height);
        });
    }
}

export default SceneManager;