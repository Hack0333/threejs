import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base Setup
 */
// Debug UI
const gui = new GUI({
  width: "100%",
  title: "Debug UI",
  closeFolders: true,
});

// GUI folders for better organization
const cameraFol = gui.addFolder("Camera");
const positionFol = gui.addFolder("Position");
const objectGroupFol = gui.addFolder("Object Group"); // Folder for objectGroup controls

// Toggle GUI visibility with the 'h' key
window.addEventListener("keydown", (e) => {
  if (e.key === "h") gui.show(gui._hidden);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const objectGroup = new THREE.Group(); // Group to manage house-related objects
const floorGroup = new THREE.Group();

/**
 * Textures
 */
//for house
const textureLoader = new THREE.TextureLoader(); // Placeholder for future textures
const colorBrick = textureLoader.load('../textures/bricks/color.jpg');
colorBrick.colorSpace = THREE.SRGBColorSpace;
const ambientBrick = textureLoader.load('../textures/bricks/ambientOcclusion.jpg');
const normalBrick = textureLoader.load('../textures/bricks/normal.jpg')
const roughnessBrick = textureLoader.load('../textures/bricks/roughness.jpg')

//for floor
const roadColor = textureLoader.load('../textures/road.jpeg');
roadColor.colorSpace = THREE.SRGBColorSpace;

/**
 * House Construction
 */
// Wall (Main structure)
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(7, 5, 7),
  new THREE.MeshStandardMaterial({  
    map: colorBrick,
    aoMap: ambientBrick,
    normalMap: normalBrick,
    roughnessMap: roughnessBrick,
    // roughness: 0.7,
  })
);
wall.position.y = 2.5; // Raise wall so it sits above the floor
objectGroup.add(wall);

// Roof (Pyramid shape)
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(5.2, 4, 4),
  new THREE.MeshStandardMaterial({ color: "#8c4a2f" })
);
roof.position.set(0, 7, 0); // Position roof on top of the walls
roof.rotation.y = Math.PI / 4; // Rotate to align with the walls
objectGroup.add(roof);

scene.add(objectGroup); // Add the house group to the scene


/**
 * Door Textures
 */
const doorColor = textureLoader.load('../textures/door/color.jpg');
doorColor.colorSpace = THREE.SRGBColorSpace;
const doorAlpha = textureLoader.load('../textures/door/alpha.jpg');
const doorAmbient = textureLoader.load('../textures/door/ambientOcclusion.jpg');
const doorHeight = textureLoader.load('../textures/door/height.jpg');
const doorMetalness = textureLoader.load('../textures/door/metalness.jpg');
const doorNormal = textureLoader.load('../textures/door/normal.jpg');
const doorRoughness = textureLoader.load('../textures/door/roughness.jpg');

/**
 * Door Mesh
 */
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4, 100, 100), // High segments for displacement mapping
  new THREE.MeshStandardMaterial({
    map: doorColor,
    alphaMap: doorAlpha,
    transparent: true, // Enable transparency for the alpha map
    aoMap: doorAmbient,
    displacementMap: doorHeight,
    displacementScale: 0.1, // Adjust displacement height
    metalnessMap: doorMetalness,
    normalMap: doorNormal,
    roughnessMap: doorRoughness,
  })
);

// Position the door on the front wall
door.position.set(0, 1.7, 3.51); // Slightly in front of the wall to avoid z-fighting
door.rotation.z = Math.PI; // Align door properly

// gui.add(door.position , "x").min(1).max(5)
// gui.add(door.position , "y").min(1).max(5)
// gui.add(door.position , "z").min(1).max(5)

// Add door to the house group
objectGroup.add(door);

/**
 * Grass Textures for Floor
 */
const grassColor = textureLoader.load('../textures/grass/color.jpg');
grassColor.colorSpace = THREE.SRGBColorSpace;
const grassAlpha = textureLoader.load('../textures/grass/alpha.jpg');
const grassAmbient = textureLoader.load('../textures/grass/ambientOcclusion.jpg');
const grassNormal = textureLoader.load('../textures/grass/normal.jpg');
const grassRoughness = textureLoader.load('../textures/grass/roughness.jpg');

// Floor (Ground plane)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 18),
  new THREE.MeshStandardMaterial({ 
    map: grassColor,
    alphaMap: grassAlpha,
    aoMap: grassAmbient,
    // displacementScale: 6, // Adjust displacement for the grass surface
    normalMap: grassNormal,
    roughnessMap: grassRoughness,
   })
);
floor.rotation.x = -Math.PI * 0.5; // Rotate floor to lie flat
floor.position.y = 0;
floor.position.z = 5;
// scene.add(floor); // Add floor to the scene
floorGroup.add(floor);

//road 
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(20,5),
  new THREE.MeshStandardMaterial({map : roadColor})
)
road.rotation.x = -Math.PI * 0.5; // Rotate floor to lie flat
road.position.y = 0.002;
road.position.z = 9;
// scene.add(road);
floorGroup.add(road);
scene.add(floorGroup);

/**
 * Lights
 */
// Ambient Light (Soft overall lighting)
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional Light (Simulating moonlight)
const moonLight = new THREE.DirectionalLight("#ffffff", 1.5);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// Adding moonLight controls to the GUI
const lightFolder = gui.addFolder("Moon Light");
lightFolder.add(moonLight, "intensity").min(0).max(1).step(0.001);
lightFolder.add(moonLight.position, "x").min(-5).max(5).step(0.001);
lightFolder.add(moonLight.position, "y").min(-5).max(5).step(0.001);
lightFolder.add(moonLight.position, "z").min(-5).max(5).step(0.001);

/**
 * GUI for Object Group
 */
objectGroupFol.add(objectGroup.position, "x").min(-10).max(10).step(0.01).name("Position X");
objectGroupFol.add(objectGroup.position, "y").min(-10).max(10).step(0.01).name("Position Y");
objectGroupFol.add(objectGroup.position, "z").min(-10).max(10).step(0.01).name("Position Z");

objectGroupFol.add(objectGroup.rotation, "x").min(0).max(Math.PI * 2).step(0.01).name("Rotation X");
objectGroupFol.add(objectGroup.rotation, "y").min(0).max(Math.PI * 2).step(0.01).name("Rotation Y");
objectGroupFol.add(objectGroup.rotation, "z").min(0).max(Math.PI * 2).step(0.01).name("Rotation Z");

objectGroupFol.add(objectGroup.scale, "x").min(0.1).max(3).step(0.01).name("Scale X");
objectGroupFol.add(objectGroup.scale, "y").min(0.1).max(3).step(0.01).name("Scale Y");
objectGroupFol.add(objectGroup.scale, "z").min(0.1).max(3).step(0.01).name("Scale Z");

/**
 * Sizes and Resizing Handling
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Update camera and renderer on window resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera settings
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer settings
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera Setup
 */
// Create a Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(5, 7, 10); // Position the camera to view the house
scene.add(camera);

// OrbitControls for interactive camera movement
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth camera movements
// controls.enableZoom = false; // Disable zoom

/**
 * Renderer Setup
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height); // Set renderer size
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI screens

/**
 * Animation Loop
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime(); // Get time for potential animations

  // Update controls for smooth camera movement
  controls.update();

  // Render the scene from the camera's perspective
  renderer.render(scene, camera);

  // Request the next frame to keep the loop going
  window.requestAnimationFrame(tick);
};

// Start the animation loop
tick();
