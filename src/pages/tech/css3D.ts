import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const create3DObject = () => {
  const div = document.createElement('div');
  div.classList.add(
    'flex',
    'justify-around',
    'py-2',
    'w-40',
    'border',
    'border-yellow-300',
    'absolute',
    'text-light-50'
  );
  div.innerHTML = ` <span>花西子</span>
  <span>79</span>`;

  const tag = new CSS3DObject(div);
  tag.position.y += 40;
  return tag;
};

export { create3DObject };
