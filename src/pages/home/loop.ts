import { renderer, camera } from './render';
import { scene } from './scene';
// import './gui';
function render() {
  scene.rotateY(0.001);
  renderer.render(scene, camera); // 执行渲染操作
  requestAnimationFrame(render); // 请求再次执行渲染函数render，渲染下一帧
}
render();
window.onresize = function () {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
};

export { renderer };
