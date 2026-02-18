import * as THREE from 'three';
import { camera } from './camera';
import { scene } from './scene';
import {
  draggableObjects,
  deskMixer,
  wardrobeMixer,
  desk,
  wardrobe
} from './model';

import { initDragControls, controls } from './controls';
import { candle1, candle2, candle3 } from './model';
import { renderer } from './renderer';
import { LAYERS } from './model';

let hoverBox = null;
let hoveredObject = null;


// wait one frame AFTER everything loads
window.addEventListener('load', () => {
  initDragControls();
});

/* ---------------- UI ---------------- */

const wardrobeHint = document.getElementById('wardrobeHint');

/* ---------------- CLOCK / DELTA ---------------- */

const clock = new THREE.Clock();
let lampTime = 0;

/* ---------------- RAYCASTING ---------------- */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



/* ---------------- HELPERS ---------------- */

// find root draggable object
function getRootDraggableObject(object) {
  let current = object;
  while (current) {
    if (draggableObjects.includes(current)) return current;
    current = current.parent;
  }
  return null;
}



/* ---------------- MOUSE TRACKING ---------------- */

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* ---------------- UPDATE: DELTA ---------------- */

export function updateDelta() {
  const delta = clock.getDelta();

  if (deskMixer) deskMixer.update(delta);
  if (wardrobeMixer) wardrobeMixer.update(delta);

  // desk lamp idle animation
  if (desk && desk.userData.lamp) {
    lampTime += delta;
    const headPivot = desk.userData.lamp.userData.headPivot;
    headPivot.rotation.x = -0.8 + Math.sin(lampTime) * 0.3;
  }

  // candle flicker
  function animateCandle(candle) {
    candle.userData.time += delta * 4;
    const flicker = Math.sin(candle.userData.time) * 0.15 + Math.random() * 0.05;
    candle.userData.light.intensity = 1.2 + flicker;
  }

  if (candle1) animateCandle(candle1);
  if (candle2) animateCandle(candle2);
  if (candle3) animateCandle(candle3);
}

/* ---------------- UPDATE: HOVER ---------------- */

export function updateHover() {
  raycaster.setFromCamera(mouse, camera);

  raycaster.layers.disableAll();
  raycaster.layers.enable(LAYERS.INTERACTABLE);
  raycaster.layers.enable(LAYERS.DRAGGABLE);

  const intersects = raycaster.intersectObjects(scene.children, true);

  let hoveringWardrobe = false;
  let hoveredDraggable = null;

  if (intersects.length > 0) {
    let obj = intersects[0].object;

    // find draggable root
    hoveredDraggable = getRootDraggableObject(obj);

    // wardrobe detection
    while (obj) {
      if (obj === wardrobe) {
        hoveringWardrobe = true;
        break;
      }
      obj = obj.parent;
    }
  }

  /* ---------- DRAG SELECTION BOX ---------- */
  if (hoveredDraggable && hoveredDraggable !== hoveredObject) {
    if (hoverBox) scene.remove(hoverBox);

    hoveredObject = hoveredDraggable;

    hoverBox = new THREE.BoxHelper(hoveredObject, 0x8B5A2B);
    hoverBox.layers.set(3); // helpers layer
    hoverBox.material.transparent = true;
    hoverBox.material.opacity = 0.85;

    scene.add(hoverBox);
  }

  if (!hoveredDraggable && hoverBox) {
    scene.remove(hoverBox);
    hoverBox = null;
    hoveredObject = null;
  }

  if (hoverBox) hoverBox.update();

  /* ---------- WARDROBE UI ---------- */
  if (!wardrobeHint) return;

  if (hoveringWardrobe) {
    wardrobeHint.textContent = 'Click to open wardrobe';
    wardrobeHint.classList.add('show');
  } else {
    wardrobeHint.classList.remove('show');
  }
}

/* ---------------- CLICK HANDLER ---------------- */

window.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  raycaster.layers.disableAll();
  raycaster.layers.enable(LAYERS.INTERACTABLE);

  const intersects = raycaster.intersectObjects(scene.children, true);

  for (const hit of intersects) {
    let obj = hit.object;

    while (obj) {
      if (obj === wardrobe) {
        const action = wardrobe.userData.animation;
        action.reset();
        action.play();
        return;
      }
      obj = obj.parent;
    }
  }
});
