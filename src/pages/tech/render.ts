import { renderer, camera, css3Renderer } from './renderCamera';
import { scene } from './scene';

function render() {
  renderer.render(scene, camera);
  css3Renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

export { renderer, css3Renderer };
