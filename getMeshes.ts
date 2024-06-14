import * as THREE from "three";

const size = 0.5;
const range = 2;
const geometry = new THREE.IcosahedronGeometry(size, 1);
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x0f0,
  wireframe: true,
});

export function getBody(scene: THREE.Scene) {

  let x = Math.random() * range - (range * 0.5);
  let y = Math.random() * range - (range * 0.5) + 0;
  let z = Math.random() * range - (range * 0.5);

  const mesh = new THREE.Mesh(geometry, mat);
  const wireMesh = new THREE.Mesh(geometry, wireMat);
  mesh.position.set(x, y, z);
  wireMesh.position.set(x, y, z);
  wireMesh.scale.setScalar(1.001);
  scene.add(wireMesh);
  return mesh;
}

export function getMouseBall() {
  const mouseSize = 0.25;
  const mouseGeometry = new THREE.IcosahedronGeometry(mouseSize, 8);
  const mouseMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
  });
  const mouseLight = new THREE.PointLight(0xffffff, 2);
  const mouseMesh = new THREE.Mesh(mouseGeometry, mouseMat);
  mouseMesh.add(mouseLight);

  function update(mousePosition: THREE.Vector2) {
    let { x, y, z } = { x: mousePosition.x * 5, y: mousePosition.y * 5, z: 1 };
    mouseMesh.position.set(x, y, z);
  }
  return { mesh: mouseMesh, update };
}
