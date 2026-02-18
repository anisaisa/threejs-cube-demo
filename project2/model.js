import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene';
import { camera } from './camera';
import { renderer } from './renderer';


export const LAYERS = {
  DEFAULT: 0,
  INTERACTABLE: 1,
  DRAGGABLE: 2,
  HELPERS: 3
};


export const draggableObjects = [];


export let wardrobeMixer = null;

export let deskMixer = null;
export let desk = null;


const textureLoader = new THREE.TextureLoader();



const loader = new GLTFLoader();


//scene.add(new THREE.AmbientLight(0xffffff, 0.6));

//const roomLight = new THREE.PointLight(0xffffff, 1.2, 10);
//roomLight.position.set(0, 2, 0);
//scene.add(roomLight);



loader.load('/models/finalroom.glb', (gltf) => {
  const model = gltf.scene;

  model.traverse(child => child.layers.set(LAYERS.DEFAULT));
  
  scene.add(model);
});

export let bed = null;


//bed
loader.load('/models/bed2.glb', (gltf) => {
bed = gltf.scene;

  // 🔹 LAYERS
  bed.layers.set(LAYERS.INTERACTABLE);
  bed.layers.enable(LAYERS.DRAGGABLE);
  bed.traverse(child => {
    child.layers.enable(LAYERS.INTERACTABLE);
    child.layers.enable(LAYERS.DRAGGABLE);
  });


  // 📍 Position bed inside the room
  bed.position.set(-0.47, 0.04, -0.1); // adjust
  bed.rotation.y =- Math.PI ;
  bed.scale.set(0.9, 0.9, 0.9);

  bed.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = true;
      child.material.side = THREE.DoubleSide;
      child.material.roughness = 2;
      child.material.metalness = 0.0;
      child.material.needsUpdate = true;
    }
  });
draggableObjects.push(bed);

  scene.add(bed);
});



function applyWhiteStandardMaterial(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: 0xf2f2f2,
        roughness: 0.6,
        metalness: 0.0
      });
      child.material.side = THREE.DoubleSide;
    }
  });
}

loader.load('/models/bedside.glb', (gltf) => {
  const bedside = gltf.scene;
 // 🔹 LAYERS
  bedside.layers.set(LAYERS.DRAGGABLE);
  bedside.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  // 📍 Position next to bed
  bedside.position.set(-0.5, 0.3, 2.1); // adjust
  bedside.scale.set(0.2, 0.2, 0.2);
  bedside.rotation.y += Math.PI;

  bedside.traverse((child) => {
   if (child.isMesh) {

     child.castShadow = true;
    child.receiveShadow = true; 
     // child.material.side = THREE.DoubleSide;
      //child.material.roughness = 0.6;   // wood / furniture
      //child.material.metalness = 0.0;
      //child.material.needsUpdate = true;
    }
  });

 applyWhiteStandardMaterial(bedside);

  draggableObjects.push(bedside);

  scene.add(bedside);
});

loader.load('/models/window1.glb', (gltf) => {
  const window1 = gltf.scene;

  window1.position.set(-0.6, 1.2, 2.5); // adjust to wall
  window1.scale.set(1, 1,1);
  window1.rotation.y = Math.PI;

  
window1.traverse((child) => {
    if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;

      child.material = new THREE.MeshStandardMaterial({
        color: 0xe6dccf,   // brown (wood-like)
        roughness: 0.6,
        metalness: 0.0
      });
      child.material.side = THREE.DoubleSide;
    }
  });

  scene.add(window1);
});

loader.load('/models/window2.glb', (gltf) => {
  const window2 = gltf.scene;

  window2.position.set(0.4, 1.2, 2.5); 
  window2.scale.set(1, 1, 1);
  window2.scale.x *= -1;//flip handle
  window2.rotation.y = Math.PI;

  window2.traverse((child) => {

   if (child.isMesh) {
     child.castShadow = true;
    child.receiveShadow = true;
 child.material = new THREE.MeshStandardMaterial({
        color: 0xe6dccf,   
        roughness: 0.6,
        metalness: 0.0
        
      });
      child.material.side = THREE.DoubleSide;
    }
  });

  scene.add(window2);
});

//export let curtain = null;
export let curtainOpen = false;

//curtains



// =====================
// CURTAIN
// =====================
export let curtainn = null;

loader.load('/models/newCurtain.glb', (gltf) => {
  curtainn = gltf.scene;

  // 📍 Position near window
  curtainn.position.set(-0.15, 0, 2.43);   // adjust if needed
  curtainn.scale.set(1, 1,1);
 curtainn.rotation.y = Math.PI;

  scene.add(curtainn);
});

//for curtains animation
window.addEventListener('keydown', (e) => {
 if (e.key === 'c' && curtainn) {
  curtainOpen = !curtainOpen;
  }
});




//drawer
loader.load('/models/drawer.glb', (gltf) => {
  const drawer = gltf.scene;

 
  // 🔹 LAYERS
  drawer.layers.set(LAYERS.DRAGGABLE);
  drawer.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });


  drawer.position.set(2.5, -0.01, 1.0);   
  drawer.scale.set(0.03, 0.03, 0.03);
  drawer.rotation.y = Math.PI;
 // drawer.rotation.y = Math.PI / 2; //ka muri ngat perdes
//drawer.rotation.y = -Math.PI / 2; ka muri perball shtratit 


  drawer.traverse((child) => {
    if (child.isMesh) {
       child.castShadow = true;
    child.receiveShadow = true;
      child.material.side = THREE.DoubleSide;

      // Optional: only if it looks too shiny
      if ('roughness' in child.material) {
        child.material.roughness =  0.75;
        child.material.metalness =  0.0;
      }

      child.material.needsUpdate = true;
    }
  });
  
  draggableObjects.push(drawer);
  scene.add(drawer);
});

//texture for rug
const rugTexture = textureLoader.load('/textures/rug.jpg');

rugTexture.colorSpace = THREE.SRGBColorSpace;
rugTexture.wrapS = rugTexture.wrapT = THREE.RepeatWrapping;
rugTexture.repeat.set(1, 1); // adjust later if stretched
const rugGeometry = new THREE.PlaneGeometry(3, 2.2);

const rugMaterial = new THREE.MeshStandardMaterial({
  map: rugTexture,
  roughness: 0.9,
  metalness: 0.0,
  side: THREE.DoubleSide
});

const rug = new THREE.Mesh(rugGeometry, rugMaterial);

//rug.rotation.x = -Math.PI / 2;
//rug.rotation.y = Math.PI / 2; ;  

rug.rotation.order = 'YXZ';
rug.rotation.set(-Math.PI / 2, Math.PI / 2, 0);


rug.position.set(0.5, 0.1, 0.4);

rug.receiveShadow = true;



scene.add(rug);



//door
loader.load('/models/door.glb', (gltf) => {
  const door = gltf.scene;
 door.position.set(23.15, 0.1, 0.2); 
  door.rotation.y = Math.PI /2;  
door.scale.set(1, 1, 1); 

  
  scene.add(door);
});

loader.load('/models/floorLamp.glb', (gltf) => {
  const floorLamp = gltf.scene;

 // 🔹 LAYERS
  floorLamp.layers.set(LAYERS.DRAGGABLE);
  floorLamp.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });




  floorLamp.position.set(2.1, 1.5, -0.4);  
  floorLamp.scale.set(0.2, 0.2, 0.2);    
 // floorLamp.rotation.y = Math.PI / 2;    

  draggableObjects.push(floorLamp);
  scene.add(floorLamp);
});


//desk

loader.load('/models/desk.glb', (gltf) => {
desk = gltf.scene;

  // 🔹 LAYERS
  desk.layers.set(LAYERS.DRAGGABLE);
  desk.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  desk.position.set(2, 0, -2.3);
  desk.scale.set(3, 3, 3);
  desk.rotation.y = Math.PI / 2;

  scene.add(desk);
   draggableObjects.push(desk);

  deskMixer = new THREE.AnimationMixer(desk);
  const action = deskMixer.clipAction(gltf.animations[0]);
  action.play();

   
  const deskLamp = createDeskLamp();
// 🔹 LAYERS
deskLamp.layers.set(LAYERS.INTERACTABLE);
deskLamp.traverse(child => {
  child.layers.enable(LAYERS.INTERACTABLE);
});


  deskLamp.scale.set(0.1, 0.1, 0.1);

  deskLamp.position.set(-0.02, 0.28, -0.4);

  // hierarchy happens HERE
  desk.add(deskLamp);
   //deskLamp.userData.headPivot.rotation.x -= -1.0;

   console.log('Draggable objects:', draggableObjects);
desk.userData.lamp = deskLamp;


  draggableObjects.push(deskLamp);

});

//texture for lamp


const lampTexture = textureLoader.load('/textures/lamp.jpg');
lampTexture.colorSpace = THREE.SRGBColorSpace;

lampTexture.wrapS = lampTexture.wrapT = THREE.RepeatWrapping;
lampTexture.repeat.set(1, 1);

 

export function createDeskLamp() {
  const lamp = new THREE.Group();
  lamp.name = 'DeskLamp';

  // ONE material for the whole lamp
  const lampMaterial = new THREE.MeshStandardMaterial({
    map: lampTexture,
    roughness: 0.5,
    metalness: 0.4
  });

  // ---------- BASE ----------
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.3, 0.05, 32),
    lampMaterial
  );
  base.position.y = 0.025;
  lamp.add(base);

  // ---------- POLE ----------
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16),
    lampMaterial
  );
  pole.position.y = 0.35;
  lamp.add(pole);

  // ---------- HEAD PIVOT ----------
  const headPivot = new THREE.Group();
  headPivot.position.y = 0.7;
  lamp.add(headPivot);

  // ---------- HEAD ----------
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.2, 24),
    lampMaterial
  );
  head.rotation.x = Math.PI / 2;
  head.position.z = 0.1;
  headPivot.add(head);

  // ---------- LIGHT ----------
  const bulb = new THREE.SpotLight(
    0xfff1cc,
    1.5,
    3,
    Math.PI / 6,
    0.3
  );

  bulb.position.set(0, 0, 0.15);
  bulb.target.position.set(0, -1, 0);

  headPivot.add(bulb);
  headPivot.add(bulb.target);

  // store references
  lamp.userData.headPivot = headPivot;
  lamp.userData.light = bulb;

  return lamp;
}


// =====================
// WARDROBE
// =====================
export let wardrobe = null;

loader.load('/models/wardrobe.glb', (gltf) => {
  wardrobe = gltf.scene;

  // 🔹 LAYERS
  wardrobe.layers.set(LAYERS.INTERACTABLE);
  wardrobe.traverse(child => {
    child.layers.enable(LAYERS.INTERACTABLE);
  });


  console.log('WARDROBE ANIMATIONS:', gltf.animations);


  // 📍 Position inside the room
  wardrobe.position.set(-1.4, 0, -1.9);
  wardrobe.scale.set(1.1, 1.1, 1.1);
  wardrobe.rotation.y = Math.PI / 2;


  scene.add(wardrobe);

  //wardrobe.userData.interaction = 'wardrobe';


  wardrobeMixer = new THREE.AnimationMixer(wardrobe);

  const action = wardrobeMixer.clipAction(gltf.animations[0]);
  action.paused = true;
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;

  // store animation on wardrobe
  wardrobe.userData.animation = action;
});


export let books = null;
export let pillows = null;
export let shelf=null;
export let makeup=null;

loader.load('/models/books.glb', (gltf) => {
  books = gltf.scene;


    // 🔹 LAYERS
  books.layers.set(LAYERS.DRAGGABLE);
  books.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  books.position.set(1.8, 1.15, 1.9);
  books.scale.set(0.2, 0.2, 0.2);

  scene.add(books); 
  
  books.userData.interaction = 'book';

  draggableObjects.push(books); // ✅ SAFE

 

});


loader.load('/models/pillows.glb', (gltf) => {
  pillows = gltf.scene;


  // 🔹 LAYERS
  pillows.layers.set(LAYERS.DRAGGABLE);
  pillows.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });


  // 📍 Position inside the room
  pillows.position.set(-2, 0.03, -1);
  pillows.scale.set(0.005, 0.005, 0.005);
 // books.rotation.y = Math.PI / 2;


  scene.add(pillows);

   draggableObjects.push(pillows);
}); 



loader.load('/models/shelf.glb', (gltf) => {
  shelf = gltf.scene;

 
  // 🔹 LAYERS
  shelf.layers.set(LAYERS.DRAGGABLE);
  shelf.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });


  // 📍 Position inside the room
  shelf.position.set(2.42, 2, 1);
  shelf.scale.set(0.008, 0.008, 0.008);
 shelf.rotation.y = -Math.PI / 2;


  scene.add(shelf);
   draggableObjects.push(shelf);
}); 

loader.load('/models/makeup.glb', (gltf) => {
  makeup = gltf.scene;
  // 🔹 LAYERS
  makeup.layers.set(LAYERS.DRAGGABLE);
  makeup.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });


  makeup.position.set(2.2, 1.15, 1);
  makeup.scale.set(0.004, 0.004, 0.004);

  scene.add(makeup);

  draggableObjects.push(makeup); // ✅ SAFE
});



export let mirror=null;



loader.load('/models/mirror.glb', (gltf) => {
  mirror = gltf.scene;


  // 🔹 LAYERS
  mirror.layers.set(LAYERS.DRAGGABLE);
  mirror.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  // 📍 Position inside the room
  mirror.position.set(2.2, 1.15, -0.0002);
  mirror.scale.set(1.5, 1.5, 1.5);
  mirror.rotation.y = Math.PI / 2;


  scene.add(mirror);

  draggableObjects.push(mirror);
  mirror.userData.interaction = 'mirror';

}); 


export let bedsidelamp=null;

loader.load('/models/bedsidelamp.glb', (gltf) => {
  bedsidelamp = gltf.scene;

   // console.log('Bedside lamp animations:', gltf.animations);

  //  LAYERS
  bedsidelamp.layers.set(LAYERS.DRAGGABLE);
  bedsidelamp.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  //  Position inside the room
  bedsidelamp.position.set(-0.48, 0.62, 2.1);
  bedsidelamp.scale.set(1.5, 1.5, 1.5);
  bedsidelamp.rotation.y = Math.PI / 2;




  scene.add(bedsidelamp);

  draggableObjects.push(bedsidelamp);
  bedsidelamp.userData.interaction = 'bedsidelamp';

});


//picture

export function createWallPicture() {
  const picture = new THREE.Group();

  // ---------- FRAME ----------
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      roughness: 0.6,
      metalness: 0.1
    })
  );
  picture.add(frame);

  // ---------- CANVAS ----------
  const canvas = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.7),
    new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.9,
      metalness: 0.0
    })
  );
  canvas.position.z = 0.016;
  picture.add(canvas);

  // ---------- MAIN CIRCLE ----------
  const circle = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 32),
    new THREE.MeshStandardMaterial({
      color: 0xc7a17a, // warm minimal tone
      roughness: 0.6
    })
  );
  circle.position.set(-0.25, 0.1, 0.017);
  picture.add(circle);

  // ---------- ABSTRACT BLACK LINES ----------
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8
  });

  const verticalLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.02, 0.4),
    lineMaterial
  );
  verticalLine.position.set(0.25, 0.05, 0.018);
  picture.add(verticalLine);

  const diagonalLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.02, 0.35),
    lineMaterial
  );
  diagonalLine.rotation.z = Math.PI / 6;
  diagonalLine.position.set(0.38, -0.12, 0.018);
  picture.add(diagonalLine);

  // ---------- COLOR BLOCK ----------
  const block = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0xd6cec3, // soft neutral
      roughness: 0.9
    })
  );
  block.position.set(0.1, -0.25, 0.0175);
  picture.add(block);

  // ---------- DOT ACCENTS ----------
  const dotMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b2b2b
  });

  for (let i = 0; i < 3; i++) {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.025, 16),
      dotMaterial
    );
    dot.position.set(-0.4 + i * 0.1, -0.3, 0.018);
    picture.add(dot);
  }

  return picture;
}


const wallPicture = createWallPicture();

// position on wall
wallPicture.position.set(-2.58, 1.65, 1.5); // adjust Z to your wall
wallPicture.rotation.y = Math.PI/2;

scene.add(wallPicture);


export let candle1 = null;
export let candle2 = null;
export let candle3 = null;
// candle
export function createCandle() {
  const candle = new THREE.Group();

  // ---------- WAX ----------
  const wax = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.09, 0.4, 32),
    new THREE.MeshStandardMaterial({
      color: 0xf2efe9,
      roughness: 0.9,
      metalness: 0.0
    })
  );
  wax.position.y = 0.2;
  candle.add(wax);

  // ---------- WICK ----------
  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.05, 8),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  wick.position.y = 0.43;
  candle.add(wick);

  // ---------- FLAME ----------
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.035, 0.1, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffc97a,
      emissive: 0xffa500,
      emissiveIntensity: 0.6
    })
  );
  flame.position.y = 0.5;
  candle.add(flame);

  // ---------- LIGHT ----------
  const light = new THREE.PointLight(0xffb76b, 1.2, 1.5, 2);
  light.position.y = 0.5;
  candle.add(light);

  // store for animation
  candle.userData.flame = flame;
  candle.userData.light = light;
  candle.userData.time = Math.random() * 10;

  return candle;
}
// ---------- CREATE CANDLES ----------
candle1 = createCandle();
candle2 = createCandle();
candle3 = createCandle();

// ---------- SCALE ----------
candle1.scale.set(0.6, 0.6, 0.6);
candle2.scale.set(0.6, 0.6, 0.6);
candle3.scale.set(0.6, 0.6, 0.6);

// ---------- LOCAL POSITIONS ----------
candle1.position.set(-0.08, 0, 0);
candle2.position.set(0, 0, 0.05);
candle3.position.set(0.08, 0, -0.03);

// ---------- GROUP ----------
const candleGroup = new THREE.Group();
candleGroup.add(candle1);
candleGroup.add(candle2);
candleGroup.add(candle3);

// ---------- LAYERS (IMPORTANT) ----------
candleGroup.layers.set(LAYERS.DRAGGABLE);
candleGroup.traverse(child => {
  child.layers.enable(LAYERS.DRAGGABLE);
});

// ---------- POSITION IN SCENE ----------
candleGroup.position.set(2, 1.1, 0.5);

// ---------- DRAGGABLE ----------
draggableObjects.push(candleGroup);

// ---------- ADD TO SCENE ----------
scene.add(candleGroup);


// =======================
// PICTURE 2 (EMPTY FRAME)
// =======================
export function createEmptyFrame(frameWidth = 1.2, frameHeight = 0.8) {
  const picture = new THREE.Group();

  // ---------- FRAME ----------
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, frameHeight, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.6,
      metalness: 0.1
    })
  );
  picture.add(frame);

  // ---------- CANVAS (TEXTURE READY) ----------
 const canvas = new THREE.Mesh(
  new THREE.PlaneGeometry(frameWidth - 0.1, frameHeight - 0.1),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide
  })
);

canvas.rotation.y = Math.PI;
canvas.position.z = 0.016;
picture.add(canvas);
picture.userData.canvas = canvas;

// picture light
const picLight = new THREE.PointLight(0xffffff, 0.8, 2);
picLight.position.set(0, 0.3, 0.6);
picture.add(picLight);

  return picture;
}

// ---------- CREATE PICTURE ----------
const emptyPicture = createEmptyFrame();

//  MARK AS PICTURE (IMPORTANT)
emptyPicture.userData.type = 'picture';

//  LAYERS (INTERACTABLE)
emptyPicture.layers.set(LAYERS.INTERACTABLE);
emptyPicture.traverse(child => {
  child.layers.enable(LAYERS.INTERACTABLE);
});

emptyPicture.position.set(-2.58, 1.65, -0.1);
emptyPicture.rotation.y = Math.PI / 2;

scene.add(emptyPicture);



// =======================
// LOAD TEXTURE 
// =======================
const texLoader = new THREE.TextureLoader();

texLoader.load(
  '/textures/anisa.jpg',
  (texture) => {
    //  texture is fully loaded here

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // ---------- APPLY TEXTURE ----------
    const canvas = emptyPicture.userData.canvas;

    canvas.material.map = texture;
    canvas.material.needsUpdate = true;
    

    // ---------- ASPECT RATIO FIX ----------
    const aspect = texture.image.width / texture.image.height;
    canvas.scale.x = aspect;
  }
);


export let myLamp=null;


loader.load('/models/mylamp.glb', (gltf) => {

  const myLamp = gltf.scene;

  //  POSITION
  myLamp.position.set(0.2, 0.61, -2);

  //  SCALE
  myLamp.scale.set(2, 2, 2);

  //  LAYERS
  myLamp.layers.set(LAYERS.DRAGGABLE);
  myLamp.traverse(child => {
    child.layers.enable(LAYERS.DRAGGABLE);
  });

  draggableObjects.push(myLamp);
  scene.add(myLamp);

  
  const lampLight = new THREE.PointLight(0xfff2cc, 2, 6);
  lampLight.position.set(0.2, 1.1, -2); // slightly above base (adjust if needed)
  scene.add(lampLight);

});

