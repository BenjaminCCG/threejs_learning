import * as THREE from 'three';
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';
const arc = new THREE.ArcCurve(0, 0, 60, Math.PI / 2 + Math.PI / 6, Math.PI / 2 - Math.PI / 6);

const pointsArr = arc.getPoints(50);

const geometry = new THREE.BufferGeometry();

geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({
  color: 0xffffff
});

// geometry.rotateX(Math.PI / 2);
// geometry.rotateY(Math.PI / (3 / 4));
// geometry.translate(0, -100, 0);
const line = new THREE.Line(geometry, material);

line.rotateX(Math.PI / 2);
const circleLine = new THREE.Group();
circleLine.add(line);
circleLine.translateY(-100);

const loader = new FontLoader();

loader.load('/helvetiker_bold.typeface.json', (font: Font) => {
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  const shapes = font.generateShapes('720°', 10);
  const geometry = new THREE.ShapeGeometry(shapes);
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.position.z = 60;
  textMesh.position.x = -12;
  circleLine.add(textMesh);
});

// const shape = new THREE.Shape()
// const fontShape = new THREE.ShapeGeometry()

export { circleLine };
