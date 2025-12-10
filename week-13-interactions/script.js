import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const infoPanel = document.querySelector("#infoPanel pre");

const cubes = [];
let previousSelected = null;
const cubeCount = 20;

for (let i = 0; i < cubeCount; i++) {
  const w = 0.5 + Math.random() * 2.5;
  const h = 0.5 + Math.random() * 2.5;
  const d = 0.5 + Math.random() * 2.5;

  const geo = new THREE.BoxGeometry(1, 1, 1);

 
  const hue = Math.random() * 360;                // random hue
  const saturation = 40 + Math.random() * 20;     // 40–60% → soft colors
  const lightness = 75 + Math.random() * 10;      // 75–85% → pastel brightness

  const pastelColor = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);


  const mat = new THREE.MeshStandardMaterial({
    color: pastelColor
  });

  const cube = new THREE.Mesh(geo, mat);

  cube.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );

  cube.scale.set(w, h, d);

  cube.userData.size = { width: w, height: h, depth: d };
  cube.userData.originalColor = cube.material.color.clone();
  cube.userData.originalScale = cube.scale.clone();

  scene.add(cube);
  cubes.push(cube);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(cubes);

  if (hits.length === 0) {
    resetPreviousCube();
    infoPanel.textContent = "No object selected.";
    return;
  }

  const selected = hits[0].object;

  resetPreviousCube();

  selected.material.color.set(0xffff00);
  selected.userData.animTime = 0;
  previousSelected = selected;

  const pos = selected.position;
  const s = selected.userData.size;

  infoPanel.textContent =
    `Cube Selected:\n` +
    `Position:\n` +
    `  x: ${pos.x.toFixed(2)}\n` +
    `  y: ${pos.y.toFixed(2)}\n` +
    `  z: ${pos.z.toFixed(2)}\n\n` +
    `Size:\n` +
    `  width:  ${s.width.toFixed(2)}\n` +
    `  height: ${s.height.toFixed(2)}\n` +
    `  depth:  ${s.depth.toFixed(2)}`;
}

function resetPreviousCube() {
  if (previousSelected) {
    previousSelected.material.color.copy(previousSelected.userData.originalColor);
    previousSelected.scale.copy(previousSelected.userData.originalScale);
    previousSelected = null;
  }
}

window.addEventListener("click", onClick);

function animate() {
  requestAnimationFrame(animate);

  if (previousSelected) {
    const t = previousSelected.userData.animTime;
    const pulse = 1 + Math.sin(t * 6) * 0.15;

    previousSelected.scale.set(
      previousSelected.userData.originalScale.x * pulse,
      previousSelected.userData.originalScale.y * pulse,
      previousSelected.userData.originalScale.z * pulse
    );

    previousSelected.userData.animTime += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
