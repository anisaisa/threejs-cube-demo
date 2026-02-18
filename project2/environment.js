import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { scene } from './scene';

new HDRLoader().load('/hdr/studio.hdr', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
  scene.environmentIntensity = 0.2;
  
 // new HDRLoader().load('/hdr/studio.hdr', (hdr) => {
  //hdr.mapping = THREE.EquirectangularReflectionMapping;
  //scene.environment = hdr;
  //scene.environmentIntensity = envIntensity;
//});
});
