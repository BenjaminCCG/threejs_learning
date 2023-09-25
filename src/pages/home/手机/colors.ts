import white from '@/assets/白.jpg';
import black from '@/assets/黑.jpg';
import gray from '@/assets/灰.jpg';
import green from '@/assets/绿.jpg';
import red from '@/assets/红.jpg';
import { model } from './model';
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

const colors = [
  {
    color: 'white',
    img: white
  },
  {
    color: 'black',
    img: black
  },
  {
    color: 'gray',
    img: gray
  },
  {
    color: 'green',
    img: green
  },
  {
    color: 'red',
    img: red
  }
];
const colorArr16 = [0x023911, 0x222222, 0x6a030a, 0x000000, 0xffffff];
const colorArr = [] as { r: number; g: number; b: number }[];

const imgClick = (index: number) => {
  // model.traverse((obj: any) => {
  //   if (obj.isMesh && obj.name.includes('外壳')) {
  //     // 如何在setStyle方法中使用colors中的变量名称
  //     obj.material.color.setStyle(colors[index].color);
  //   }
  // });
  setColor(colorArr[index].r, colorArr[index].g, colorArr[index].b);
};

// 转为十进制
// eslint-disable-next-line @typescript-eslint/prefer-for-of
for (let i = 0; i < colorArr16.length; i++) {
  const color = new THREE.Color(colorArr16[i]);
  colorArr.push({
    r: color.r,
    g: color.g,
    b: color.b
  });
}

const color = {
  r: colorArr[0].r,
  g: colorArr[0].g,
  b: colorArr[0].b
}; // mesh颜色值
const tweenArr = []; // 所有动画片段tween的集合
// 批量创建动画片段tween
for (let i = 0; i < colorArr.length; i++) {
  const tween1 = new TWEEN.Tween(color)
    .to(
      {
        r: colorArr[i].r,
        g: colorArr[i].g,
        b: colorArr[i].b
      },
      1000
    )
    .onUpdate(() => {
      setColor(color.r, color.g, color.b);
    });
  const tween2 = new TWEEN.Tween(color);
  if (i < colorArr.length - 1) {
    tween2
      .to(
        {
          r: colorArr[i + 1].r,
          g: colorArr[i + 1].g,
          b: colorArr[i + 1].b
        },
        1000
      )
      .onUpdate(() => {
        setColor(color.r, color.g, color.b);
      });
  } else {
    tween2
      .to(
        {
          r: colorArr[0].r,
          g: colorArr[0].g,
          b: colorArr[0].b
        },
        1000
      )
      .onUpdate(() => {
        setColor(color.r, color.g, color.b);
      });
  }
  tweenArr.push(tween1, tween2);
}
// 批量连接所有动画片段
for (let i = 0; i < tweenArr.length - 1; i++) {
  tweenArr[i].chain(tweenArr[i + 1]);
}
tweenArr[tweenArr.length - 1].chain(tweenArr[0]); // 首尾相接循环执行
tweenArr[0].start(); // 播放一串动画片段

function setColor(r: number, g: number, b: number) {
  model.traverse((obj: any) => {
    if (obj.isMesh && obj.name.includes('外壳')) {
      obj.material.color.setRGB(r, g, b);
    }
  });
}

const colorTween = tweenArr[0];

export { colors, imgClick, colorTween };
