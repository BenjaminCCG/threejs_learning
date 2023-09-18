// import { group, group2 } from './model';
import { model } from './model';
import { scene } from './scene';
import { renderer, camera, labelRenderer } from './render';

const bool = ref(true);
function render() {
  // group.rotateY(-0.01);
  // group2.rotateZ(0.01);
  // mesh.rotateZ(0.01);
  // tag.rotateY(0.01);
  if (bool.value) model.rotateY(0.005);
  labelRenderer.render(scene, camera);
  renderer.render(scene, camera); // 执行渲染操作
  requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
}
render();

export { renderer, labelRenderer, bool };
