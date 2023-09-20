import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(6000, 6000);

const texture = new THREE.TextureLoader().load('/model2/瓷砖.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(12, 12);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  // side: THREE.DoubleSide,
  color: 0x222222
});

const floor = new THREE.Mesh(geometry, material);
floor.rotateX(-Math.PI / 2);
export { floor };
