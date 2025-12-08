import { renderPictures } from './pictures.js';
import { photosArray } from './photos.js';
import { initForm } from './form-validation.js';
import { initEffects } from './effects.js'

document.addEventListener('DOMContentLoaded', () => {
  const photos = photosArray;
  renderPictures(photos);

  initForm();

  initEffects();
});
