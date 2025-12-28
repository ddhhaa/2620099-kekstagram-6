import { renderPictures } from './pictures.js';
import { initForm } from './form-validation.js';
import { initEffects } from './effects.js';
import { getData } from './api.js';
import { initFilters } from './filters.js';

let photos = [];

const RERENDER_DELAY = 500;

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeoutDelay);
  };
};


const clearPictures = () => {
  const pictureElements = document.querySelectorAll('.picture');
  pictureElements.forEach((picture) => picture.remove());
};

const updatePictures = (picturesData) => {
  clearPictures();
  renderPictures(picturesData);
};


const showErrorMessage = () => {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('data-error');
  errorContainer.textContent = 'Не удалось загрузить данные.';
  document.body.appendChild(errorContainer);
};


getData()
  .then((data) => {
    photos = [...data];

    renderPictures(photos);

    initFilters(
      photos,
      debounce(updatePictures, RERENDER_DELAY)
    );

    initEffects();
    initForm();
  })
  .catch(() => {
    showErrorMessage();
  });
