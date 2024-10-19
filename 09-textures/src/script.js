import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//texture
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.addEventListener("load",()=>{
//   texture.needsUpdate = true;
// })
// image.src = "../textures/door/color.jpg";

const loadingManager = new THREE.LoadingManager();
loadingManager.onError = () => {
  console.log("error");
}
loadingManager.onLoad = () => {
  console.log("load");
}
loadingManager.onProgress = () => {
  console.log("progress");
}

const TextureLoader = new THREE.TextureLoader(loadingManager);
const color = TextureLoader.load("../textures/door/color.jpg");
color.colorSpace = THREE.SRGBColorSpace;
// color.repeat.x = 2;
// color.repeat.y = 3;

// color.wrapS = THREE.RepeatWrapping;
// color.wrapT = THREE.RepeatWrapping;

// color.wrapS = THREE.MirroredRepeatWrapping;

// color.offset.x = -0.5;

// color.rotation = Math.PI / 4;

//rotation from center
// color.center.x = 0.5;
// color.center.y = 0.5

const minecraft = TextureLoader.load("../textures/minecraft.png")

//increace the quility
minecraft.magFilter = THREE.NearestFilter;
minecraft.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry(1,32,32);
// const geometry = new THREE.TorusGeometry(1,0.38,32,200);
// const material = new THREE.MeshBasicMaterial({ color : "#ff0000" });
// const material = new THREE.MeshBasicMaterial({ map:color });
const material = new THREE.MeshBasicMaterial({ map: minecraft });
// const material = new THREE.MeshBasicMaterial({ map: texture});
const mesh = new THREE.Mesh(geometry, material);
//uv attribute
console.log(geometry.attributes.uv);

scene.add(mesh);

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
camera.position.z = 1;
scene.add(camera);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
