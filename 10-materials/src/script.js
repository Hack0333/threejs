import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//texture
const textureLoader = new THREE.TextureLoader();
const color = textureLoader.load("../textures/door/color.jpg");
const aplha = textureLoader.load("../textures/door/alpha.jpg");
const normal = textureLoader.load("../textures/door/normal.jpg");
const metalness = textureLoader.load("../textures/door/metalness.jpg");
const roughness = textureLoader.load("../textures/door/roughness.jpg");
console.log(color);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("../textures/environmentMap/2k.hdr",(EnvironmentMap)=>{
    EnvironmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = EnvironmentMap;
    scene.environment = EnvironmentMap;
});

const material = new THREE.MeshBasicMaterial();
material.map = color;
// material.color.set = "red";
// material.transparent = true;
// material.opacity = 0.5;;
// material.color = new THREE.color("red")
// material.side = new THREE.DoubleSide;
// material.side = new THREE.FrontSide;
// material.side = new THREE.BackSide;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1),material);
scene.add(plane);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,16,16),material);
scene.add(sphere);
sphere.position.x = -1.5;
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4,0.2,16,50),material);
scene.add(torus)
torus.position.x = 1.5;


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()