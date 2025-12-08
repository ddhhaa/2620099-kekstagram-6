// js/scale.js
const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100
};

const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const imageElement = document.querySelector('.img-upload__preview img');

let currentScale = Scale.DEFAULT;

const updateScale = () => {
  scaleInput.value = `${currentScale}%`;
  imageElement.style.transform = `scale(${currentScale / 100})`;
};

const onSmallerButtonClick = () => {
  if (currentScale > Scale.MIN) {
    currentScale -= Scale.STEP;
    updateScale();
  }
};

const onBiggerButtonClick = () => {
  if (currentScale < Scale.MAX) {
    currentScale += Scale.STEP;
    updateScale();
  }
};

const resetScale = () => {
  currentScale = Scale.DEFAULT;
  updateScale();
};

const initScale = () => {
  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
  resetScale();
};

const destroyScale = () => {
  smallerButton.removeEventListener('click', onSmallerButtonClick);
  biggerButton.removeEventListener('click', onBiggerButtonClick);
  resetScale();
};

export { initScale, destroyScale, resetScale };
