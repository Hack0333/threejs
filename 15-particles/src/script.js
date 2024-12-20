import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/particles/2.png")

/**
 * Test cube
 */
// const particleGeometry = new THREE.SphereGeometry(2,25,25);
const particleGeometry = new THREE.BufferGeometry();
const count = 2000;
const color = new Float32Array(count * 3);
const position = new Float32Array(count*3);
for(let i=0;i<count*3;i++){
  position[i] = (Math.random()  - 0.5) * 12;
  color[i] = Math.random();
}
particleGeometry.setAttribute("position",new THREE.BufferAttribute(position,3));
particleGeometry.setAttribute("color",new THREE.BufferAttribute(color,3));


const particleMaterial = new THREE.PointsMaterial({size:0.1});
particleMaterial.sizeAttenuation = true;
particleMaterial.transparent = true;
particleMaterial.color = new THREE.Color("#ff88cc")
particleMaterial.map = texture;
// particleMaterial.alphaTest = 0.001;
// particleMaterial.depthTest = false;
particleMaterial.depthWrite = false;
// particleMaterial.blending = new THREE.AdditiveBlending;
particleMaterial.vertexColors = true


const particle = new THREE.Points(particleGeometry,particleMaterial)
scene.add(particle);

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
camera.position.z = 8;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor("white");

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
