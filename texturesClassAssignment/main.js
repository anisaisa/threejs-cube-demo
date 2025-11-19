import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader();
const tigerTexture = textureLoader.load('tiger_texture.jpg');

tigerTexture.wrapS = THREE.RepeatWrapping;
tigerTexture.wrapT = THREE.RepeatWrapping;
tigerTexture.repeat.set(1, 1);


const geometry = new THREE.SphereGeometry(1, 32, 32);


const material = new THREE.MeshBasicMaterial({ map: tigerTexture });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function animate(){
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    sphere.rotation.x += 0.005;
    renderer.render(scene, camera);
}
animate();
