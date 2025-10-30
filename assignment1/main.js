import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(35, 40, 65);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Shared materials
const groundMat = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

const whiteMat = new THREE.MeshPhongMaterial({ color: 0xDADADA });
const lightGreyMat = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });
const greyMat = new THREE.MeshStandardMaterial({ color: 0x555555 });

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const leavesMat = new THREE.MeshStandardMaterial({ color: 0x0B6623 });
const bushMat = new THREE.MeshStandardMaterial({ color: 0x0A5F2E });

const lampPoleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const lampBulbMat = new THREE.MeshStandardMaterial({
  color: 0xffffcc,
  emissive: 0xfff2b5,
  emissiveIntensity: 0.6
});

// Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 63), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Roads
const roadVertical = new THREE.Mesh(new THREE.PlaneGeometry(8, 63), roadMat);
roadVertical.rotation.x = -Math.PI / 2;
roadVertical.position.set(3, 0.01, 0);
scene.add(roadVertical);

const roadConnector = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), roadMat);
roadConnector.rotation.x = -Math.PI / 2;
roadConnector.position.set(3, 0.01, 22);
scene.add(roadConnector);

const roadHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(30, 8), roadMat);
roadHorizontal.rotation.x = -Math.PI / 2;
roadHorizontal.position.set(20, 0.01, -11.4);
scene.add(roadHorizontal);

// Buildings
const blueMat = new THREE.MeshPhongMaterial({ color: 0x1E90FF }); // DodgerBlue

const bluePart1 = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 12), blueMat);
const bluePart2 = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 12), blueMat);


bluePart1.position.set(-9, 1.75, 6);
bluePart2.position.set(-9, 1.75, -7);

bluePart1.castShadow = bluePart2.castShadow = true;
bluePart1.receiveShadow = bluePart2.receiveShadow = true;

scene.add(bluePart1, bluePart2);


const blueBuildingMat = new THREE.MeshPhongMaterial({ color: 0x1E90FF }); 

const blueBuilding = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 9), blueBuildingMat);
blueBuilding.position.set(22.5, 2.5, -25); 
blueBuilding.castShadow = blueBuilding.receiveShadow = true;
scene.add(blueBuilding);



const greyBuilding = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 14), greyMat);
greyBuilding.position.set(18, 2.5, 6);
greyBuilding.castShadow = true;
scene.add(greyBuilding);

// Bushes
function makeBush(x, z) {
  const bush = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), bushMat);
  bush.position.set(x, 1.2, z);
  bush.castShadow = true;
  scene.add(bush);
}
makeBush(-16, -20);
makeBush(-13, -23);
makeBush(-7, -25);
makeBush(-20, -22);
makeBush(-17, -25);
makeBush(-3, -25);
makeBush(-7, -20);
// Trees
function makeTree(x, z) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 4, 8), trunkMat);
  trunk.position.set(x, 2, z);
  trunk.castShadow = true;

  const leaves = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 12), leavesMat);
  leaves.position.set(x, 5, z);
  leaves.castShadow = true;

  scene.add(trunk, leaves);
}

makeTree(15, 25);
makeTree(25, 29);
makeTree(32, 14);
makeTree(28, 16);
makeTree(34, 18);
makeTree(26,20);
makeTree(19, 21);
makeTree(-10, 22);
makeTree(-15, 24);
makeTree(28, 26);

// Trash bin
function makeTrashBin(x, z) {
  const bin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 2, 16),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f })
  );
  bin.position.set(x, 1, z);
  bin.castShadow = true;
  scene.add(bin);

  const lid = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
  );
  lid.rotation.x = -Math.PI / 2;
  lid.position.set(x, 2.1, z);
  lid.castShadow = true;
  scene.add(lid);
}
makeTrashBin(-5, 15);

// Road borders
function createRoadBorders() {
  const borderMat = new THREE.MeshStandardMaterial({ color: 0x2f7d32 });

  for (let z = -30; z <= 30; z += 4) {
    let leftBorder = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 3.8), borderMat);
    leftBorder.position.set(-1, 0.15, z);
    leftBorder.castShadow = true;
    scene.add(leftBorder);

    let rightBorder = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 3.8), borderMat);
    rightBorder.position.set(7, 0.15, z);
    rightBorder.castShadow = true;
    scene.add(rightBorder);
  }

  for (let x = 7; x <= 33; x += 3) {
    let topBorder = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 0.5), borderMat);
    topBorder.position.set(x +1.1, 0.15, -15);
    topBorder.castShadow = true;
    scene.add(topBorder);

    let bottomBorder = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 0.5), borderMat);
    bottomBorder.position.set(x +1.1, 0.15, -8);
    bottomBorder.castShadow = true;
    scene.add(bottomBorder);
  }
}
createRoadBorders();

// Benches
function makeBench(x, z, rotationY = 0) {
  const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const benchMetalMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });

  const bench = new THREE.Group();

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 0.8), benchWoodMat);
  seat.position.y = 0.8;
  seat.castShadow = true;
  bench.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1, 0.15), benchWoodMat);
  backrest.position.set(0, 1.3, -0.3);
  backrest.castShadow = true;
  bench.add(backrest);

  const legPositions = [
    [-1, 0.4, 0.3],
    [1, 0.4, 0.3],
    [-1, 0.4, -0.3],
    [1, 0.4, -0.3]
  ];

  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), benchMetalMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    bench.add(leg);
  });

  bench.position.set(x, 0, z);
  bench.rotation.y = rotationY;
  scene.add(bench);
}

// Bench placement
makeBench(30, -18, 0);
makeBench(27, -18, 0);
makeBench(33, -18, 0);
makeBench(15, -18, 0);
makeBench(12, -18, 0);
makeBench(18, -18, 0);

// Autumn leaves
function makeAutumnLeaf(x, z) {
  const leafColors = [0xFF6B35, 0xFFAA33, 0xDD4400, 0xCC5500, 0xFF8C42];
  const color = leafColors[Math.floor(Math.random() * leafColors.length)];
  
  const leafGeom = new THREE.PlaneGeometry(0.3, 0.4);
  const leafMat = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
  
  const leaf = new THREE.Mesh(leafGeom, leafMat);
  leaf.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
  leaf.rotation.z = Math.random() * Math.PI * 2;
  leaf.position.set(x, 0.05, z);
  leaf.receiveShadow = true;
  scene.add(leaf);
}

for (let i = 0; i < 400; i++) {
  const x = (Math.random() - 0.5) * 60;
  const z = (Math.random() - 0.5) * 55;
  
  const onVerticalRoad = (x > -1 && x < 7);
  const onHorizontalRoad = (z > -15 && z < -8 && x > 7);
  
  if (!onVerticalRoad && !onHorizontalRoad) {
    makeAutumnLeaf(x, z);
  }
}

// Lamps
function makeLamp(x, z) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 12), lampPoleMat);
  pole.position.set(x, 2, z);
  pole.castShadow = true;
  scene.add(pole);

  const bulb = new THREE.PointLight(0xffee88, 0.8, 18);
  bulb.position.set(x, 4.4, z);
  bulb.castShadow = false;
  scene.add(bulb);

  const cover = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 10), lampBulbMat);
  cover.position.set(x, 4.4, z);
  scene.add(cover);
}

// Lamp placement
[25, 15, 5, -5, -15, -25].forEach(z => {
  makeLamp(7, z);
  makeLamp(-1, z);
});
[10, 20, 30].forEach(x => {
  makeLamp(x, -15);
  makeLamp(x, -8);
});

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.22);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
sunLight.position.set(60, 40, 15);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.bias = -0.001;
scene.add(sunLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
