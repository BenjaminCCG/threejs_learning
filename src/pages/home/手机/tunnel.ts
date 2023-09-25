import * as THREE from 'three';

const sphereGroup = new THREE.Group();
const R = 700;
const geometry = new THREE.CylinderGeometry(R * 1.01, R * 1.01, R * 9, 32, 1, true);
const material = new THREE.MeshPhongMaterial({
  color: 0x222222,
  side: THREE.BackSide
});

const sphereMesh = new THREE.Mesh(geometry, material);
sphereGroup.add(sphereMesh);
sphereGroup.rotateZ(Math.PI / 2);
export { sphereGroup };
