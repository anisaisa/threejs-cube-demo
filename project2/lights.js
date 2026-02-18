import * as THREE from 'three';
import { scene } from './scene';

// Ceiling light
export const ceilingLight = new THREE.PointLight(0xffe6cc, 0.5, 60);
ceilingLight.position.set(0, 5, 0);
ceilingLight.castShadow = true;
ceilingLight.shadow.mapSize.set(1024, 1024);
ceilingLight.shadow.bias = -0.001;
scene.add(ceilingLight);

// Ambient light
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Room light
export const roomLight = new THREE.PointLight(0xffffff, 1.2, 10);
roomLight.position.set(0, 2, 0);
scene.add(roomLight);

// Directional main light
export const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(10, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

// Fill light
export const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-10, 10, -5);
scene.add(fillLight);
