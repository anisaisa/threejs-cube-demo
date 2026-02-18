import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import * as THREE from 'three';

import { scene } from './scene';
import { camera } from './camera';
import { renderer } from './renderer';
import { draggableObjects, desk, bed } from './model';
import {
  ambientLight,
  ceilingLight,
  roomLight,
  dirLight,
  fillLight
} from './lights';


// ======================
// STATE
// ======================
export let selectedObject = null;

let dragControls = null;
let dragStartY = 0;
const originalTransforms = new Map();

let originalCameraPos = null;
let originalCameraTarget = new THREE.Vector3();

//  click vs drag detection
let pointerMoved = false;


// ======================
// ORBIT CONTROLS
// ======================
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// ======================
// DRAG CONTROLS
// ======================
export function initDragControls() {
  dragControls = new DragControls(
    draggableObjects,
    camera,
    renderer.domElement
  );

  dragControls.transformGroup = true;

  dragControls.addEventListener('dragstart', (event) => {
    pointerMoved = false;
    controls.enabled = false;

    let obj = event.object;
    while (obj.parent && !draggableObjects.includes(obj)) {
      obj = obj.parent;
    }

    selectedObject = obj;
    dragStartY = selectedObject.position.y;

    if (!originalTransforms.has(obj)) {
      originalTransforms.set(obj, {
        position: obj.position.clone(),
        rotation: obj.rotation.clone(),
        scale: obj.scale.clone()
      });
    }
  });

  dragControls.addEventListener('drag', () => {
    pointerMoved = true;

    if (selectedObject) {
      selectedObject.position.y = dragStartY;
    }
  });

  dragControls.addEventListener('dragend', () => {
    controls.enabled = true;
  });
}


// ======================
// CLICK (BED ONLY)
// ======================
const raycaster = new THREE.Raycaster();

raycaster.layers.set(1); // INTERACTABLE only

const mouse = new THREE.Vector2();
const overlay = document.getElementById('overlay');

renderer.domElement.addEventListener('pointerdown', (event) => {
  if (overlay.classList.contains('show')) return;

  // block ONLY real drags
  if (pointerMoved) {
    pointerMoved = false;
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (!intersects.length) return;

  let obj = intersects[0].object;

  while (obj) {
    if (obj === bed) {
      openBedUI();
      return;
    }
    obj = obj.parent;
  }

  if (draggableObjects.includes(obj)) {
    selectedObject = obj;
  }
});


// ======================
// ROTATE / RESET
// ======================
const rotateLeftBtn  = document.getElementById('rotateLeft');
const rotateRightBtn = document.getElementById('rotateRight');
const rotate90Btn    = document.getElementById('rotate90');
const resetBtn       = document.getElementById('resetObject');

rotateLeftBtn?.addEventListener('click', () => {
  if (!selectedObject) return;
  selectedObject.rotation.y += 0.1;
});

rotateRightBtn?.addEventListener('click', () => {
  if (!selectedObject) return;
  selectedObject.rotation.y -= 0.1;
});

rotate90Btn?.addEventListener('click', () => {
  if (!selectedObject) return;
  selectedObject.rotation.y += Math.PI / 2;
});

resetBtn?.addEventListener('click', () => {
  if (!selectedObject) return;

  const original = originalTransforms.get(selectedObject);
  if (!original) return;

  selectedObject.position.copy(original.position);
  selectedObject.rotation.copy(original.rotation);
  selectedObject.scale.copy(original.scale);
});


// ======================
// LAMP BUTTONS
// ======================
const lampOnBtn  = document.getElementById('lampOn');
const lampOffBtn = document.getElementById('lampOff');

lampOnBtn?.addEventListener('click', () => {
  if (!desk?.userData.lamp) return;
  desk.userData.lamp.userData.light.visible = true;
});

lampOffBtn?.addEventListener('click', () => {
  if (!desk?.userData.lamp) return;
  desk.userData.lamp.userData.light.visible = false;
});


// ======================
// DAY / NIGHT MODE
// ======================
const dayBtn   = document.getElementById('dayMode');
const nightBtn = document.getElementById('nightMode');

dayBtn?.addEventListener('click', () => {
  ambientLight.intensity = 0.6;
  ambientLight.color.set(0xffffff);

  ceilingLight.visible = true;
  roomLight.visible = true;
  dirLight.visible = true;
  fillLight.visible = true;

  scene.environmentIntensity = 0.5;
  renderer.toneMappingExposure = 0.8;
});

nightBtn?.addEventListener('click', () => {
  ambientLight.intensity = 0.005;
  ambientLight.color.set(0x1a2333);

  ceilingLight.visible = false;
  roomLight.visible = false;
  dirLight.visible = false;
  fillLight.visible = false;

  scene.environmentIntensity = 0.01;
  renderer.toneMappingExposure = 0.15;
});


// ======================
// OVERLAY SYSTEM
// ======================
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const closeOverlay = document.getElementById('closeOverlay');

function openOverlay(title, text, images = []) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;

  const gallery = document.getElementById('overlayGallery');
  if (gallery) {
    gallery.innerHTML = '';
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      gallery.appendChild(img);
    });
  }

  overlay.classList.add('show');
  controls.enabled = false;
}


// ======================
// BED UI
// ======================
function openBedUI() {
  focusOnBed();

 
 openOverlay(
  'A Gentle Pause',
  'This room is a breath of calm.Soft light, warm tones, and quiet details come together to create a space where the mind can rest.A space that does not ask for attention, but offers comfort.Here, everything feels lighter.',
  [
    '/images/room.jpg',
    '/images/room2.jpeg',
    '/images/room3.jpeg'
  ]
);


}

closeOverlay?.addEventListener('click', () => {
  overlay.classList.remove('show');
  returnCamera();
  controls.enabled = true;
  originalCameraPos = null;
});


// ======================
// CAMERA ANIMATION
// ======================
function focusOnBed() {
  if (!originalCameraPos) {
    originalCameraPos = camera.position.clone();
    originalCameraTarget.copy(controls.target);
  }

  const target = bed.position.clone();
  const start = camera.position.clone();
  const end = new THREE.Vector3(
    target.x + 0.6,
    target.y + 1.2,
    target.z + 1.8
  );

  let t = 0;
  function animate() {
    t += 0.03;
    if (t >= 1) return;

    camera.position.lerpVectors(start, end, t);
    camera.lookAt(target);
    requestAnimationFrame(animate);
  }
  animate();
}

function returnCamera() {
  if (!originalCameraPos) return;

  const start = camera.position.clone();
  const end = originalCameraPos.clone();
  let t = 0;

  function animateBack() {
    t += 0.03;
    if (t >= 1) {
      camera.position.copy(end);
      controls.target.copy(originalCameraTarget);
      controls.update();
      return;
    }

    camera.position.lerpVectors(start, end, t);
    camera.lookAt(originalCameraTarget);
    requestAnimationFrame(animateBack);
  }

  animateBack();
}

window.addEventListener('load', () => {
  const welcome = document.getElementById('welcomeTitle');

  // Fade in
  welcome.style.opacity = '1';

  // Fade out after 3 seconds
  setTimeout(() => {
    welcome.style.opacity = '0';
  }, 3000);
});