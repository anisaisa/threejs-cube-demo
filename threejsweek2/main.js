import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Axes helper
const axes = new THREE.AxesHelper(14);
scene.add(axes);

// Group
const group = new THREE.Group();
group.scale.set(1.5, 1.5, 1.5);
group.rotation.y = 0.5;
scene.add(group);

// Common cube geometry and material
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
];

// Create three cubes with same size
const cube1 = new THREE.Mesh(cubeGeometry, materials[0]);
cube1.position.x = -2;
group.add(cube1);

const cube2 = new THREE.Mesh(cubeGeometry, materials[1]);
cube2.position.x = 0;
group.add(cube2);

const cube3 = new THREE.Mesh(cubeGeometry, materials[2]);
cube3.position.x = 2;
group.add(cube3);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Animate rotation
function animate() {
    requestAnimationFrame(animate);

    cube1.rotation.y += 0.02;
    cube2.rotation.y += 0.02;
    cube3.rotation.y += 0.02;

    renderer.render(scene, camera);
}

animate();
