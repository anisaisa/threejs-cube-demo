import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();
const scene = new THREE.Scene();


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
directionalLight.castShadow = true;
scene.add(directionalLight);

const material1 = new THREE.MeshStandardMaterial({ roughness: 0.8 });
gui.add(material1, 'metalness').min(0).max(1).step(0.001);
gui.add(material1, 'roughness').min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material1
);
sphere.castShadow = true;
scene.add(sphere);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material1
);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

scene.background = new THREE.Color(0x202020);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(1, 1, 5);
scene.add(camera);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();


function tick() {
    const elapsedTime = clock.getElapsedTime();

    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
