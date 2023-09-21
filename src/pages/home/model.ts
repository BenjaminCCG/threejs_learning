/* eslint-disable guard-for-in */
import * as THREE from 'three';
// import * as dat from 'dat.gui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { camera } from './render';
import TWEEN from '@tweenjs/tween.js';
import { play } from './audio';
import { createSprite } from './sprite';
import { lensflare1, lensflare2 } from './carLight';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
const loader = new GLTFLoader();
const model = new THREE.Group();
const gui = new GUI({ width: 300 });

const material = {
  metalness: 1,
  roughness: 0.2,
  envMapIntensity: 1,

  mirrorMetalness: 1,
  mirrorRoughness: 0,
  mirrorEnvMapIntensity: 1
};
const textureCube = new THREE.CubeTextureLoader()
  .setPath('/model2/envMap/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
const texture = new THREE.TextureLoader().load('/model2/Tyre_Normal.png');

loader.load('/model2/轿车.glb', (glft) => {
  glft.scene.traverse((obj: any) => {
    if (obj.isMesh) {
      if (obj.name.includes('轮胎')) {
        obj.material.normalMap = texture;
      } else if (obj.name.includes('高光金属')) {
        // obj.material.metalness = 1
        // obj.material.roughness = 0.4
        obj.material = new THREE.MeshStandardMaterial({
          color: obj.material.color,
          metalness: material.metalness,
          roughness: material.roughness,
          envMapIntensity: material.envMapIntensity
        });
      } else if (obj.name.includes('后视镜')) {
        obj.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: material.mirrorMetalness,
          roughness: material.mirrorRoughness,
          envMapIntensity: material.mirrorEnvMapIntensity
        });
      } else if (obj.name.includes('外壳')) {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: obj.material.color,
          clearcoat: 1,
          clearcoatRoughness: 0.01,
          metalness: 0.9,
          roughness: 0.5,
          envMapIntensity: 2.5
        });
      } else if (obj.name.includes('玻璃')) {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0x000000,
          metalness: 0,
          roughness: 0,
          transparent: true,
          transmission: 0.5
        });
      }
      obj.material.envMap = textureCube;
    }
  });
  const light1 = glft.scene.getObjectByName('镜头光晕1');
  const light2 = glft.scene.getObjectByName('镜头光晕2');
  light1?.add(lensflare1);
  light2?.add(lensflare2);

  const tagNameArr = ['右前光标', '右后光标', '左前光标', '左后光标', '后备箱光标'];
  const doorNameArr = [
    {
      name: '右前门',
      rotate: Math.PI / 3,
      click: false
    },
    {
      name: '右后门',
      rotate: Math.PI / 3,
      click: false
    },
    {
      name: '左前门',
      rotate: -Math.PI / 3,
      click: false
    },
    {
      name: '左后门',
      rotate: -Math.PI / 3,
      click: false
    },
    {
      name: '后备箱',
      rotate: Math.PI / 3,
      click: false
    }
  ];
  const spriteArr = [] as THREE.Sprite[];
  tagNameArr.forEach((item, index) => {
    const sprite = createSprite();
    const tagObj = glft.scene.getObjectByName(item);
    if (index === 1 || index === 3) {
      sprite.position.x += 10;
      sprite.position.y += 6;
    }
    sprite.userData.index = index;
    spriteArr.push(sprite);
    tagObj?.add(sprite);
  });

  // glft.scene.getObjectByName('右前门')?.rotateY(Math.PI / 3);
  // glft.scene.getObjectByName('右后门')?.rotateY(Math.PI / 3);
  // glft.scene.getObjectByName('左前门')?.rotateY(-Math.PI / 3);
  // glft.scene.getObjectByName('左后门')?.rotateY(-Math.PI / 3);
  // glft.scene.getObjectByName('后备箱')?.rotateZ(Math.PI / 3);

  // const mesh1 = glft.scene.getObjectByName('轮胎03')!;

  // eslint-disable-next-line max-params
  const doorMove = (obj: THREE.Object3D, k: string, rotate: number, open: boolean) => {
    new TWEEN.Tween(obj.rotation)
      .to({ [k]: rotate }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      .onStart(() => {
        open && play(true);
      })
      .onComplete(() => {
        !open && play(false);
      }); // 启动动画
  };
  addEventListener('click', (event) => {
    const px = event.clientX;
    const py = event.clientY;
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersect = raycaster.intersectObjects(spriteArr);

    if (intersect.length > 0) {
      const index = intersect[0].object.userData.index;
      const mesh = glft.scene.getObjectByName(doorNameArr[index].name)!;
      if (index !== 4) {
        if (!doorNameArr[index].click) {
          doorNameArr[index].click = true;

          // mesh?.rotateY(doorNameArr[index].rotate);
          // new TWEEN.Tween(mesh.rotation)
          //   .to({ y: doorNameArr[index].rotate }, 1000)
          //   .easing(TWEEN.Easing.Quadratic.Out)
          //   .start();
          doorMove(mesh, 'y', doorNameArr[index].rotate, true);
        } else {
          doorNameArr[index].click = false;
          // mesh?.rotateY(-doorNameArr[index].rotate);
          // new TWEEN.Tween(mesh.rotation)
          //   .to({ y: mesh.rotation.y - doorNameArr[index].rotate }, 1000)
          //   .easing(TWEEN.Easing.Quadratic.Out)
          //   .start(); // 启动动画

          doorMove(mesh, 'y', mesh.rotation.y - doorNameArr[index].rotate, false);
        }
      } else {
        if (!doorNameArr[index].click) {
          doorNameArr[index].click = true;
          // mesh?.rotateZ(doorNameArr[index].rotate);
          // new TWEEN.Tween(mesh.rotation)
          //   .to({ z: doorNameArr[index].rotate }, 1000)
          //   .easing(TWEEN.Easing.Quadratic.Out)
          //   .start(); // 启动动画
          doorMove(mesh, 'z', doorNameArr[index].rotate, true);
        } else {
          doorNameArr[index].click = false;
          // mesh?.rotateZ(-doorNameArr[index].rotate);
          // new TWEEN.Tween(mesh.rotation)
          //   .to({ z: mesh.rotation.z - doorNameArr[index].rotate }, 1000)
          //   .easing(TWEEN.Easing.Quadratic.Out)
          //   .start(); // 启动动画
          doorMove(mesh, 'z', mesh.rotation.z - doorNameArr[index].rotate, false);
        }
      }
    }
  });

  model.add(glft.scene);
});
// function rotateAnimation() {
//   TWEEN.update();
//   requestAnimationFrame(rotateAnimation);
// }
// rotateAnimation();

const setValue = (name: string, key: string, val: number) => {
  model.traverse((obj: any) => {
    if (obj.isMesh && obj.name.includes(name)) {
      obj.material[key] = val;
    }
  });
};
const folder1 = gui.addFolder('高光金属');
folder1
  .add(material, 'metalness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('高光金属', 'metalness', val);
  });

folder1
  .add(material, 'roughness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('高光金属', 'roughness', val);
  });

folder1
  .add(material, 'envMapIntensity', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('高光金属', 'envMapIntensity', val);
  });

const folder2 = gui.addFolder('后视镜');
folder2
  .add(material, 'mirrorMetalness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('后视镜', 'mirrorMetalness', val);
  });
folder2
  .add(material, 'mirrorRoughness', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('后视镜', 'mirrorRoughness', val);
  });
folder2
  .add(material, 'mirrorEnvMapIntensity', 0, 1)
  .step(0.1)
  .onChange((val: number) => {
    setValue('后视镜', 'mirrorEnvMapIntensity', val);
  });

export { model };
