import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { model } from './model';
const gui = new GUI();
const material = {
  metalness: 1,
  roughness: 0.2
};
gui
  .add(material, 'metalness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    model.traverse((obj: any) => {
      if (obj.isMesh && obj.name.includes('高光金属')) {
        obj.material.metalness = val;
      }
    });
  });
gui
  .add(material, 'roughness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    model.traverse((obj: any) => {
      if (obj.isMesh && obj.name.includes('高光金属')) {
        obj.material.roughness = val;
      }
    });
  });
export { gui };
