import * as THREE from 'three';
import { create3DObject } from './css3D';

const geometry = new THREE.BoxGeometry(50, 50, 50);

const material = new THREE.MeshLambertMaterial({
  color: 0xcccccc
});
const mesh = new THREE.Mesh(geometry, material) as any;

const model = new THREE.Group();
model.add(mesh);

// const tag = create2DObject()
const tag = create3DObject();
model.add(tag);

export { model, mesh };
