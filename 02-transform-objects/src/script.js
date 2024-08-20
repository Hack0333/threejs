import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);

// mesh.position.x = 1;
// mesh.position.y = 1;
// mesh.position.z =-1;
// set mesh length to 1
// mesh.position.normalize();

// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(new THREE.Vector3(1,2,1)));

// mesh.scale.set(0.5,1,.9);
// mesh.rotateX(35);
// mesh.rotation.reorder("ZYX")
// scene.add(mesh);

const group = new THREE.Group();
scene.add(group)

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ color: "red" })
)
group.add(box1);

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ color: "green" })
)
group.add(box2);

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ color: "white" })
)
group.add(box3);

box1.position.x =-2;
box2.position.x = 2;

// moving all the box together
group.position.set(0.5,2,-1)
/**
 * Sizes
 */
const sizes = {
  width: 700,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
// camera.position.set(1,1,3);
// camera.lookAt(mesh.position)
// console.log(mesh.position.distanceTo(camera.position));

// const axesHelper = new THREE.AxesHelper()
// red = x , green = y , blue = z
// scene.add(axesHelper);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

