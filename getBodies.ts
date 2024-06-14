import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";

const sceneMiddle = new THREE.Vector3(0, 0, 0);
const range = 6;

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true
});

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x990000,
  wireframe: true
});

function getBody(world: RAPIER.World) {
  const size = 0.1 + Math.random() * 0.25;
  const density = size * 1.0;
  let x = Math.random() * range - range * 0.5;
  let y = Math.random() * range - range * 0.5 + 3;
  let z = Math.random() * range - range * 0.5;
  // Physics
  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
  let rigid = world.createRigidBody(rigidBodyDesc);
  let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
  world.createCollider(colliderDesc, rigid);

  const geometry = new THREE.IcosahedronGeometry(size, 1);
  const mesh = new THREE.Mesh(geometry, material);

  const wireMesh = new THREE.Mesh(geometry, wireMat);
  wireMesh.scale.setScalar(1.001);
  mesh.add(wireMesh);

  function update() {
    rigid.resetForces(true);
    let { x, y, z } = rigid.translation();
    let pos = new THREE.Vector3(x, y, z);
    let dir = pos.clone().sub(sceneMiddle).normalize();
    rigid.addForce(dir.multiplyScalar(-0.5), true);
    mesh.position.set(x, y, z);
  }
  return { mesh, rigid, update };
}

const mouseSize = 0.25;
const geometry = new THREE.IcosahedronGeometry(mouseSize, 8);
const mouseMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
});
function getMouseBall(world: RAPIER.World) {
  const mouseLight = new THREE.PointLight(0xffffff, 1);
  const mouseMesh = new THREE.Mesh(geometry, mouseMaterial);
  mouseMesh.add(mouseLight);
  // RIGID BODY
  let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0)
  let mouseRigid = world.createRigidBody(bodyDesc);
  let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 3.0);
  world.createCollider(dynamicCollider, mouseRigid);
  function update(mousePos: THREE.Vector2) {
    mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 }, true);
    let { x, y, z } = mouseRigid.translation();
    mouseMesh.position.set(x, y, z);
  }
  return { mesh: mouseMesh, update };
}

export { getBody, getMouseBall };
