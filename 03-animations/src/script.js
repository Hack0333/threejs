import * as THREE from "three";
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 700,
  height: 500,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);

// JS Method
// let time = Date.now();
// const tick = () => {
//   // console.log("tickong");
//   const current = Date.now();
//   const delta = current - time;
//   time = current;

//   // mesh.position.x += -0.01 ;
//   mesh.rotation.y += 0.001 * delta;
//   renderer.render(scene,camera);
//   window.requestAnimationFrame(tick);
  
// }
// tick();

// Three inbult method

const clock = new THREE.Clock();

const tick = ()=>{
  const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = Math.cos(elapsedTime);
  // mesh.rotation.x = elapsedTime;
  // mesh.rotation.z = elapsedTime;
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);

  // camera.position.x = Math.sin(elapsedTime);
  // camera.position.y = Math.cos(elapsedTime);
  // camera.lookAt(mesh.position);
  renderer.render(scene,camera);
  window.requestAnimationFrame(tick)
}
tick();
gsap.to(mesh.position,{
  x:2,
  y:2,
  duration:5,
  delay: 1,

})
