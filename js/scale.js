const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100
};

const getElement = (selector) => {
  const element = document.querySelector(selector);
  return element;
};

const scaleInput = getElement('.scale__control--value');
const smallerButton = getElement('.scale__control--smaller');
const biggerButton = getElement('.scale__control--bigger');
const imageElement = getElement('.img-upload__preview img');

let currentScale = Scale.DEFAULT;


const updateScale = () => {
  if (!scaleInput || !imageElement) {
    return;
  }

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

  if (!smallerButton || !biggerButton) {
    return;
  }

  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
  resetScale();
};

const destroyScale = () => {
  if (smallerButton) {
    smallerButton.removeEventListener('click', onSmallerButtonClick);
  }
  if (biggerButton) {
    biggerButton.removeEventListener('click', onBiggerButtonClick);
  }
};

export { initScale, destroyScale, resetScale };
