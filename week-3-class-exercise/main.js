import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(7, 5, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(8, 12, 6);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5, 0xffff00);
scene.add(lightHelper);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x66cdaa,
  roughness: 0.9,
  metalness: 0.1,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff66cc,
  roughness: 0.1,
  metalness: 0.9,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-5, 2, 0); // lifted by half height to rotate above floor
cube.castShadow = true;
scene.add(cube);

const coneGeometry = new THREE.ConeGeometry(1.2, 2.5, 32);
const coneMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x9b59b6,
  roughness: 0.1,
  metalness: 0.8,
  clearcoat: 0.5,
  clearcoatRoughness: 0.05,
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(-1, 2, 0); // lift by half height + radius
cone.castShadow = true;
scene.add(cone);

const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xf5deb3,
  roughness: 0.4,
  metalness: 0.5,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(3, 2, 0); // lift by radius to avoid floor collision
torus.castShadow = true;
scene.add(torus);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  cone.rotation.x += 0.015;
  cone.rotation.y += 0.015;

  torus.rotation.x += 0.02;
  torus.rotation.y += 0.02;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
