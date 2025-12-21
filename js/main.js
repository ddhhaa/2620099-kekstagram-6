import { renderPictures } from './pictures.js';
import { initForm } from './form-validation.js';
import { initEffects } from './effects.js';
import { getData } from './api.js';

let photos = [];

const showErrorMessage = () => {
  const errorContainer = document.createElement('div');
  errorContainer.textContent = 'Не удалось загрузить данные.';
  document.body.appendChild(errorContainer);
};

getData()
  .then((data) => {
    photos = data;
    renderPictures(photos);

    initForm();
    initEffects();
  })
  .catch(() => {
    showErrorMessage();
  });
