import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const lampBulbs = [];

let lampsOn = true;


window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'l') {
    lampsOn = !lampsOn;

    lampLights.forEach(light => {
      if (light) light.intensity = lampsOn ? 4 : 0;
    });

    lampBulbs.forEach(bulb => {
      if (bulb) bulb.material.emissiveIntensity = lampsOn ? 0.6 : 0.05;
    });
  }
});

 
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableBuildings);

  if (intersects.length > 0) {
    const building = intersects[0].object;

    if (!building.userData.isHighlighted) {
      // Switch to highlight color
      building.material = highlightMat;
      building.userData.isHighlighted = true;
    } else {
      // Restore original texture/material
      building.material = building.userData.originalMaterial;
      building.userData.isHighlighted = false;
    }
  }
});


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

renderer.outputColorSpace = THREE.SRGBColorSpace;


// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(35, 40, 65);
camera.lookAt(0, 0, 0);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
 
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Texture loader
const textureLoader = new THREE.TextureLoader();

const blueBuildingTexture = textureLoader.load('textures/box.jpg');
blueBuildingTexture.wrapS = blueBuildingTexture.wrapT = THREE.RepeatWrapping;
blueBuildingTexture.repeat.set(2, 1);

// Ground textures
const grassTexture = textureLoader.load('textures/grass.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const roadTexture = textureLoader.load('textures/asphalt.jpg');
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(4, 10);

// Building textures
const brickTexture = textureLoader.load('textures/brick.jpg');
brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(2, 1);

const concreteTexture = textureLoader.load('textures/concrete.jpg');


//clicking for colors
const highlightMat = new THREE.MeshStandardMaterial({
  color: 0x00aaff,      // blue highlight (change if you want)
  opacity: 5,        // texture still visible
  roughness: 0.4,
  metalness: 0.1
});


const gltfLoader = new GLTFLoader();


const glassMat = new THREE.MeshStandardMaterial({
  color: 0x88ccee,
  transparent: true,
  opacity: 0.5,
  roughness: 0.1,
  metalness: 0.2
});

//glass material to concrete building
const window1 = new THREE.Mesh(
  new THREE.BoxGeometry(10, 4, 0.2),
  glassMat
);

window1.position.set(18, 4, 13.1);
scene.add(window1);

const window2 = window1.clone();
window2.position.set(18, 4, -1.1);
scene.add(window2);

// Shared materials
const groundMat = new THREE.MeshStandardMaterial({
  map: grassTexture
});

const roadMat = new THREE.MeshStandardMaterial({
  map: roadTexture
});


const whiteMat = new THREE.MeshPhongMaterial({ color: 0xDADADA });
const lightGreyMat = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });
const concreteMat = new THREE.MeshStandardMaterial({
  map: concreteTexture
});


const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const leavesMat = new THREE.MeshStandardMaterial({ color: 0x0B6623 });
const bushMat = new THREE.MeshStandardMaterial({ color: 0x0A5F2E });

const lampPoleMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const lampBulbMat = new THREE.MeshStandardMaterial({
  color: 0xffffcc,
  emissive: 0xfff2b5,
  emissiveIntensity: 0.1
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
const brickMat = new THREE.MeshStandardMaterial({
  map: brickTexture
});


const bluePart1 = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 12), brickMat);
const bluePart2 = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 12), brickMat);



bluePart1.position.set(-9, 1.75, 6);
bluePart2.position.set(-9, 1.75, -7);

bluePart1.castShadow = bluePart2.castShadow = true;
bluePart1.receiveShadow = bluePart2.receiveShadow = true;

scene.add(bluePart1, bluePart2);


const blueBuildingMat = new THREE.MeshStandardMaterial({
  map: blueBuildingTexture
});


const blueBuilding = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 9), blueBuildingMat);
blueBuilding.position.set(22.5, 2.5, -25); 
blueBuilding.castShadow = blueBuilding.receiveShadow = true;
scene.add(blueBuilding);



const greyBuilding = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 14), concreteMat);

greyBuilding.position.set(18, 5,6);
greyBuilding.castShadow = true;
scene.add(greyBuilding);

const clickableBuildings = [
  bluePart1,
  bluePart2,
  blueBuilding,
  greyBuilding
];

clickableBuildings.forEach(building => {
  building.userData.originalMaterial = building.material;
  building.userData.isHighlighted = false;
});

let statue;
//model for statue
gltfLoader.load(
  'models/statue.glb',
  (gltf) => {
    statue = gltf.scene;

    statue.scale.set(1.2, 1.2, 1.2);
    statue.position.set(-4, -4, 20); // TEMP safe position
    statue.rotation.y = 0;

    statue.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(statue);
  },
  undefined,
  (error) => {
    console.error('Statue load error:', error);
  }
);

let student;


//student
gltfLoader.load(
  'models/student_2.glb',  
  (gltf) => {
    const student = gltf.scene;

   
    student.scale.set(2, 2, 2);

    // Place on grass (adjust Y if floating)
    student.position.set(2, 3, 10);

    // Face toward campus
    student.rotation.y = Math.PI;

    // Enable shadows
    student.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(student);
  },
  undefined,
  (error) => {
    console.error('Student GLB load error:', error);
  }
);


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





function makeLamp(x, z) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 4, 12),
    lampPoleMat
  );
  pole.position.set(x, 2, z);
  pole.castShadow = true;
  scene.add(pole);

  const bulbLight = new THREE.PointLight(0xffee88, 4, 40);
  bulbLight.position.set(x, 4.4, z);
  scene.add(bulbLight);

  const bulbMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 10, 10),
    lampBulbMat
  );
  bulbMesh.position.set(x, 4.4, z);
  scene.add(bulbMesh);

  lampBulbs.push(bulbMesh);   // 👈 store bulb mesh

  return bulbLight;           // 👈 store light
}



// Lamp placement
const lampLights = [];

[25, 15, 5, -5, -15, -25].forEach(z => {
lampLights.push(makeLamp(7, z));
lampLights.push(makeLamp(-1, z));

});
[10, 20, 30].forEach(x => {
lampLights.push(makeLamp(x, -15));
lampLights.push(makeLamp(x, -8));

});

// Lighting setup
// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);


const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(60, 40, 15);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.bias = -0.001;
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

if (statue) {
  
  statue.rotation.y += 0.003;
}

  // Lamp animation (only when ON)
  if (lampsOn) {
    const time = Date.now() * 0.003;
    lampLights.forEach(light => {
      if (light) {
        light.intensity = 3.5 + Math.sin(time) * 1.0;
      }
    });
  }

  // REQUIRED for camera + rendering
  controls.update();
  renderer.render(scene, camera);
}



animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
