import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

const guiChange = {};

guiChange.size = 0.001;
guiChange.count = 5000;
guiChange.radius = 2;
guiChange.branch = 4;
guiChange.spin = 1;
guiChange.randomness = 0.5;
guiChange.power = 3;
guiChange.innerColor = "#ff6030";
guiChange.outerColor = "#1b3984";
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
let particleGeometry = null;
let particleMaterial = null;
let particle = null;

const galaxy = () => {
  if (particle) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(particle);
  }
  particleGeometry = new THREE.BufferGeometry();

  let position = new Float32Array(guiChange.count * 3);
  let color = new Float32Array(guiChange.count * 3);

  for (let i = 0; i < guiChange.count ; i++) {
    let i3 = i * 3;
    const radius = Math.random() * guiChange.radius ;

    const branch = ((i % guiChange.branch) / guiChange.branch) * Math.PI * 2;

    const spin = radius * guiChange.spin;

    const randomX = Math.pow(Math.random(),guiChange.power) * (Math.random() < 0.5 ? 1 : -1) *guiChange.randomness * radius;

    const randomY = Math.pow(Math.random(),guiChange.power) * (Math.random() < 0.5 ? 1 : -1) *guiChange.randomness * radius;

    const randomZ = Math.pow(Math.random(),guiChange.power) * (Math.random() < 0.5 ? 1 : -1) *guiChange.randomness * radius ;

    position[i3] = Math.cos(branch + spin) * radius + randomX;
    position[i3 + 1] = randomY;
    position[i3 + 2] = Math.sin(branch + spin) * radius + randomZ;

    const innerColor = new THREE.Color(guiChange.innerColor);
    const outerColor = new THREE.Color(guiChange.outerColor);
    
    const mixedColor = innerColor.clone();
    mixedColor.lerp(outerColor, radius/guiChange.radius);

    color[i3] = mixedColor.r;
    color[i3 + 1] = mixedColor.g;
    color[i3 + 2] = mixedColor.b;

  }
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(position, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(color,3));

  particleMaterial = new THREE.PointsMaterial({
    size: guiChange.size,
    sizeAttenuation : true,
    blending : THREE.AdditiveBlending,
    vertexColors : true,
  });
  particle= new THREE.Points(
    particleGeometry,
    particleMaterial
  );

  scene.add(particle);
};
galaxy();

//gui
gui.add(guiChange, "count").min(5000).max(1000000).step(100).onChange(galaxy);
gui.add(guiChange,"size").min(0.001).max(0.1).step(0.001).onChange(galaxy);
gui.add(guiChange,"radius").min(0.1).max(20).step(0.1).onChange(galaxy);
gui.add(guiChange,"branch").min(2).max(10).step(1).onChange(galaxy);
gui.add(guiChange,"spin").min(-5).max(8).step(0.001).onChange(galaxy);
gui.add(guiChange,"randomness").min(0.1).max(2).step(0.1).onChange(galaxy);
gui.add(guiChange,"power").min(2).max(10).step(1).onChange(galaxy);
gui.addColor(guiChange,"outerColor").onFinishChange(galaxy);
gui.addColor(guiChange,"innerColor").onFinishChange(galaxy);

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 2;
scene.add(camera);

//stars
let starPos = new Float32Array(guiChange.count * 3);
for(let i=0; i< guiChange.count ; i++){
  starPos[i] = (Math.random() - 0.5) * camera.position.distanceTo(particle.position) * 50;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position",new THREE.BufferAttribute(starPos,3));
const starMaterial = new THREE.PointsMaterial({
  size : guiChange.size
});
const stars = new THREE.Points(starGeometry,starMaterial);
scene.add(stars);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

  stars.rotation.y = elapsedTime / 8;
  particle.rotation.y = elapsedTime / 9;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
