import * as THREE from "three";
import { TWEEN } from "https://cdn.jsdelivr.net/npm/three@0.131/examples/jsm/libs/tween.module.min.js";
const transitionParams = {
  // useTexture: true,
  transition: 0,
  texture: 5,
  cycle: true,
  animate: false, // Disable auto animation
  // threshold: 0.3,
};

export function getTransition({ renderer, sceneA, sceneB }) {

  const scene = new THREE.Scene();
  const w = window.innerWidth;
  const h = window.innerHeight;
  const camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -10, 10);

  const textures = [];
  const loader = new THREE.TextureLoader();

  for (let i = 0; i < 3; i++) {
    textures[i] = loader.load(`./img/transition${i}.png`);
  }

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse1: {
        value: null,
      },
      tDiffuse2: {
        value: null,
      },
      mixRatio: {
        value: 0.0,
      },
      threshold: {
        value: 0.1,
      },
      useTexture: {
        value: 1,
      },
      tMixTexture: {
        value: textures[0],
      },
    },
    vertexShader: `varying vec2 vUv;
    void main() {
      vUv = vec2( uv.x, uv.y );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`,
    fragmentShader: `
      uniform float mixRatio;
      uniform sampler2D tDiffuse1;
      uniform sampler2D tDiffuse2;
      uniform sampler2D tMixTexture;
      uniform int useTexture;
      uniform float threshold;
      varying vec2 vUv;

      void main() {
      	vec4 texel1 = texture2D( tDiffuse1, vUv );
      	vec4 texel2 = texture2D( tDiffuse2, vUv );

      	if (useTexture == 1) {
      		vec4 transitionTexel = texture2D( tMixTexture, vUv );
      		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
      		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

      		gl_FragColor = mix( texel1, texel2, mixf );
      	} else {
      		gl_FragColor = mix( texel2, texel1, mixRatio );
      	}
      }`,
  });

  const geometry = new THREE.PlaneGeometry(w, h);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
  material.uniforms.tDiffuse2.value = sceneB.fbo.texture;

  // Scroll-based transition
  let scrollY = 0;
  let targetScrollY = 0;
  const scrollSensitivity = 0.002;
  
  // Add scroll event listener
  const handleScroll = (event) => {
    event.preventDefault(); // Prevent actual scrolling
    
    // Get scroll delta
    const delta = event.deltaY || event.detail || event.wheelDelta;
    targetScrollY += delta * scrollSensitivity;
    
    // Clamp between 0 and 1
    targetScrollY = Math.max(0, Math.min(1, targetScrollY));
  };
  
  // Add event listeners for different scroll events
  window.addEventListener('wheel', handleScroll, { passive: false });
  window.addEventListener('DOMMouseScroll', handleScroll, { passive: false }); // Firefox
  
  // Smooth transition animation
  const smoothTransition = () => {
    scrollY += (targetScrollY - scrollY) * 0.1; // Smooth interpolation
    transitionParams.transition = scrollY;
    requestAnimationFrame(smoothTransition);
  };
  smoothTransition();
  let needsTextureChange = false;

  const render = (delta) => {
    // Texture cycling based on transition value
    if (transitionParams.cycle) {
      if (
        transitionParams.transition <= 0.1 ||
        transitionParams.transition >= 0.9
      ) {
        if (needsTextureChange) {
          transitionParams.texture =
            (transitionParams.texture + 1) % textures.length;
          material.uniforms.tMixTexture.value =
            textures[transitionParams.texture];
          needsTextureChange = false;
        }
      } else {
        needsTextureChange = true;
      }
    }

    material.uniforms.mixRatio.value = transitionParams.transition;

    // Prevent render both scenes when it's not necessary
    if (transitionParams.transition === 0) {
      sceneA.update(delta);
      sceneB.render(delta, false);
    } else if (transitionParams.transition === 1) {
      sceneA.render(delta, false);
      sceneB.update(delta);
    } else {
      // When 0<transition<1 render transition between two scenes
      sceneA.render(delta, true);
      sceneB.render(delta, true);

      renderer.setRenderTarget(null); // null sets the rt to the canvas
      renderer.render(scene, camera);
    }
  };
  return { render };
}
