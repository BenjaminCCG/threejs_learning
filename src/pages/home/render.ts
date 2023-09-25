import { renderer, camera } from './renderCamera';
import { scene } from './scene';
import TWEEN from '@tweenjs/tween.js';

function render() {
  TWEEN.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export { renderer };
