import * as THREE from 'three';

import { scene } from './scene';
import { camera } from './camera';
import { renderer } from './renderer';
import { controls } from './controls';
import { curtainn, draggableObjects } from './model';
import { updateHover } from './other';
import { updateDelta } from './other';
import {  wardrobeMixer } from './model';
import './lights';
import './environment';
import {  curtainOpen, deskMixer } from './model';




function animate() {
  requestAnimationFrame(animate);



   updateHover();  

   updateDelta();

  if (curtainn) {
    const targetX = curtainOpen ? -0.6 : 0;
    curtainn.position.x += (targetX - curtainn.position.x) * 0.08;
  }



  
  controls.update();
  renderer.render(scene,camera);
}

animate();
