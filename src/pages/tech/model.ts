import * as THREE from 'three';
import { create3DObject } from './css3D';
import { camera } from './renderCamera';
import TWEEN from '@tweenjs/tween.js';

const geometry = new THREE.BoxGeometry(50, 50, 50);

const material = new THREE.MeshLambertMaterial({
  color: 0xcccccc
});
const mesh = new THREE.Mesh(geometry, material) as any;

addEventListener('click', (event) => {
  const px = event.clientX;
  const py = event.clientY;
  const x = (px / window.innerWidth) * 2 - 1;
  const y = -(py / window.innerHeight) * 2 + 1;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const intersect = raycaster.intersectObjects([mesh]);
  if (intersect.length > 0) {
    const mesh = intersect[0].object;
    (mesh as any).material.color.setStyle('yellow');

    const tween1 = new TWEEN.Tween(mesh.position)
      .to({
        x: 100
      })
      .easing(TWEEN.Easing.Linear.None);
    const tween2 = new TWEEN.Tween(mesh.position)
      .to({
        z: 100
      })
      .easing(TWEEN.Easing.Linear.None);
    tween1.chain(tween2);
    tween1.start();
  }
});

const model = new THREE.Group();
model.add(mesh);

// const tag = create2DObject()
const tag = create3DObject();
model.add(tag);

export { model, mesh };
