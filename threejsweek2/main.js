import * as THREE from 'three';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x202020);

const camera=
new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z=3;

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry=new THREE.BoxGeometry(1,1,1);
const material=new THREE.MeshBasicMaterial({color:0x00ff88});
const cubeMesh=new THREE.Mesh(geometry,material);
scene.add(cubeMesh);


//cubeMesh.position.x=0.7
//cubeMesh.position.y=-0.6
//cubeMesh.position.z=1

//cubeMesh.posotion.set(0.7,-0.6,1); //x,y,z

console.log("distance of cube from camera",cubeMesh.position.distanceTo(camera.position))

//Axes helper
const axes=new THREE.AxesHelper(14)
scene.add(axes)

//scaling objects
//cubeMesh.scale.x=2
//cubeMesh.scale.y=0.25
//cubeMesh.scale.z=0.5

//rotating
//cubeMesh.rotation.x=Math.PI * 0.25
//cubeMesh.rotation.y=Math.PI * 0.25


cubeMesh.position.x=0.7
cubeMesh.position.y=-0.6
cubeMesh.position.z=1
cubeMesh.scale.x=2
cubeMesh.scale.y=0.25
cubeMesh.scale.z=0.5
cubeMesh.rotation.x=Math.PI * 0.25
cubeMesh.rotation.y=Math.PI * 0.25


const light=new THREE.DirectionalLight(0xffffff,1);
light.position.set(2,2,5);
scene.add(light);


//cubeMesh.rotation.x=10;

function animate(){
    requestAnimationFrame(animate);
   // cubeMesh.rotation.x +=0.01;
    renderer.render(scene,camera);
}

animate()