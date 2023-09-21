import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';
const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load('/model2/lensflare.jpg') as any;

const lensflare1 = new Lensflare();
const lensflare2 = new Lensflare();

lensflare1.addElement(new LensflareElement(texture, 512, 0));
lensflare2.addElement(new LensflareElement(texture, 512, 0));

const openLight = () => {
  lensflare1.visible = true;
  lensflare2.visible = true;
};

const closeLight = () => {
  lensflare1.visible = false;
  lensflare2.visible = false;
};

closeLight();

export { lensflare1, lensflare2, openLight, closeLight };
