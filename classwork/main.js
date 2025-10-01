import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Axes helper
const axes = new THREE.AxesHelper(14);
scene.add(axes);


const group = new THREE.Group();
group.scale.set(1.2, 1.2, 1.2);
scene.add(group);

//Pyramid
const pyramid = new THREE.Mesh(
  new THREE.ConeGeometry(1, 1.5, 4), // radius, height, 4 sides = pyramid
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
pyramid.position.x = -4;
group.add(pyramid);

//  Polyhedron (Dodecahedron)
const polyhedron = new THREE.Mesh(
  new THREE.DodecahedronGeometry(1), // radius
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
polyhedron.position.x = 0;
group.add(polyhedron);

// Rectangle (Cuboid)
const rectangle = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 0.5), // width, height, depth
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
rectangle.position.x = 4;
group.add(rectangle);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(3, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 0.6); // soft light
scene.add(ambient);

// Animate rotation
function animate() {
  requestAnimationFrame(animate);

  pyramid.rotation.y += 0.01;
  polyhedron.rotation.x += 0.02;
  rectangle.rotation.y += 0.015;

  renderer.render(scene, camera);
}

animate();
