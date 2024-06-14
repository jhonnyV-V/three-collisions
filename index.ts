import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import RAPIER from "@dimforge/rapier3d";
import { getBody, getMouseBall } from "./getBodies";

type Body = {
  mesh: THREE.Mesh
  rigid: RAPIER.RigidBody
  update: () => void

}

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 1;
bloomPass.radius = 0;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

let mousePosition = new THREE.Vector2();

let gravity = { x: 0.0, y: 0, z: 0.0 };
const world = new RAPIER.World(gravity);

const numBodies = 90;
const bodies: Body[] = [];
for (let index = 0; index < numBodies; index++) {
  const body = getBody(world);
  scene.add(body.mesh);
  bodies.push(body);
}

const mouseBall = getMouseBall(world);
scene.add(mouseBall.mesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444,);
hemiLight.position.set(-2, 0.5, 1.5);
scene.add(hemiLight);

function animate(t: number = 0) {
  requestAnimationFrame(animate);

  world.step();
  mouseBall.update(mousePosition);
  for (const body of bodies) {
    body.update();
  }
  composer.render(t);
  //controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

function handleMouseMove(evt: MouseEvent) {
  mousePosition.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, false);
