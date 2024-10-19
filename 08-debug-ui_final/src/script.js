import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI({
  width: 300,
  title: "DubugUI",
  closeFolders: true,
});

window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});
const guiProps = {};
//adding folder
const scrol = gui.addFolder("Position");
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
guiProps.color = "#ff0000";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: guiProps.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// material.wireframe = true;
// gui.add(mesh.position, "y").min(-3).max(3).step(0.0001).name("positionY");
// gui.add(mesh.position, "x").min(-3).max(3).step(0.0001).name("positionX");
// gui.add(mesh.position, "z").min(-3).max(3).step(0.0001).name("positionZ");
//creating folder
scrol.add(mesh.position, "y").min(-3).max(3).step(0.0001).name("positionY");
scrol.add(mesh.position, "x").min(-3).max(3).step(0.0001).name("positionX");
scrol.add(mesh.position, "z").min(-3).max(3).step(0.0001).name("positionZ");

gui.add(material,"wireframe");


gui.addColor(guiProps,"color").onChange(()=>{material.color.set(guiProps.color)});

//creating folder
// scrol.addColor(guiProps,"color").onChange(()=>{material.color.set(guiProps.color)});

guiProps.spin = () =>{
  gsap.to(mesh.rotation,{duration:1, y : mesh.rotation.y + Math.PI * 3 });
}

//gui button, function trigger on button click
gui.add(guiProps,"spin") 

//changing the segments
guiProps.segment = 2;
gui.add(guiProps,"segment").onChange(()=>{
  mesh.geometry.dispose();
  mesh.geometry = new THREE.BoxGeometry(1,1,1,guiProps.segment,guiProps.segment,guiProps.segment);//width,height,depth
}).min(2).max(10).step(1);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = false;
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
