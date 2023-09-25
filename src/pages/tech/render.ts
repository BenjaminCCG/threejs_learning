import { renderer, camera, css3Renderer } from './renderCamera';
import { scene } from './scene';
import TWEEN from '@tweenjs/tween.js';

function render() {
  TWEEN.update();
  renderer.render(scene, camera);
  css3Renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export { renderer, css3Renderer };
