import * as THREE from 'three';

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(8, 8, 12);

camera.layers.enable(0); // default
camera.layers.enable(1); // interactable
camera.layers.enable(2); // draggable
camera.layers.enable(3); // helpers
