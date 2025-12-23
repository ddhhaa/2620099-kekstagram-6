import { initEffects, destroyEffects} from './effects.js';
import { initScale, destroyScale } from './scale.js';
import { sendData } from './api.js';


const fileInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const form = document.querySelector('.img-upload__form');

const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');


let pristine = null;

const cancelButton = document.querySelector('#upload-cancel');

const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');

const submitButton = document.querySelector('.img-upload__submit');

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const FILE_TYPES = ['jpg', 'jpeg', 'png'];


fileInput.addEventListener('change', () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
});

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const validateHashtags = (value) => {
  if (!value.trim()){return true;}

  const tags = value.trim().toLowerCase().split(/\s+/);

  if (tags.length > 5) {
    return false;
  }

  const pattern = /^#[a-zа-яё0-9]{1,19}$/i;

  return tags.every((tag) => pattern.test(tag)) &&
         new Set(tags).size === tags.length;
};

const getHashtagError = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().split(/\s+/);
  const regex = /^#[a-zа-яё0-9]{1,19}$/i;
  const seen = new Set();

  if (hashtags.length > MAX_HASHTAGS) {
    return `Не более ${MAX_HASHTAGS} хэштегов`;
  }

  for (const tag of hashtags) {
    if (!regex.test(tag)) {
      if (tag === '#') {
        return 'Хэш-тег не может состоять только из решётки';
      }

      if (tag.length > MAX_HASHTAG_LENGTH) {
        return `Максимальная длина хэш-тега ${MAX_HASHTAG_LENGTH} символов`;
      }

      if (!tag.startsWith('#')) {
        return 'Хэш-тег должен начинаться с символа #';
      }

      if (/\s/.test(tag.slice(1))) {
        return 'Хэш-тег не может содержать пробелы';
      }

      if (/[^\wа-яё]/i.test(tag.slice(1))) {
        return 'Хэш-тег содержит недопустимые символы';
      }

      return 'Неверный формат хэш-тега';
    }

    const lowerCaseTag = tag.toLowerCase();
    if (seen.has(lowerCaseTag)) {
      return 'Один и тот же хэш-тег не может быть использован дважды';
    }
    seen.add(lowerCaseTag);
  }

  return '';
};

const loadPicture = () => {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      return;
    }
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const imageUrl = URL.createObjectURL(file);

      previewImage.src = imageUrl;

      effectsPreviews.forEach((preview) => {
        preview.style.backgroundImage = `url('${imageUrl}')`;
      });
    }
  });
};

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  initEffects();
  initScale();

  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error',
  });

  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagError);
  pristine.addValidator(descriptionInput, validateComment, 'Не более 140 символов');

  document.addEventListener('keydown', onEscape);
};


function closeForm() {
  form.reset();

  if (pristine) {
    pristine.reset();
  }

  destroyEffects();
  destroyScale();
  fileInput.value = '';
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
}


function onEscape(evt) {
  if (evt.key === 'Escape') {
    closeForm();
  }
}


cancelButton.addEventListener('click', closeForm);


const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return;
  }

  const message = template.content.querySelector('section').cloneNode(true);
  document.body.append(message);

  const button = message.querySelector('button');
  const inner = message.querySelector('div');

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  };

  const onOverlayClick = (evt) => {
    if (inner && !inner.contains(evt.target)) {
      closeMessage();
    }
  };


  function closeMessage() {
    message.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOverlayClick);
    if (button) {
      button.removeEventListener('click', closeMessage);
    }
  }

  if (button) {
    button.addEventListener('click', closeMessage);
  }

  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOverlayClick);
};


export function initForm() {
  loadPicture();

  fileInput.addEventListener('change', () => {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    openForm();
    document.addEventListener('keydown', onEscape);
  });

  cancelButton.addEventListener('click', closeForm);

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!pristine.validate()) {
      return;
    }

    const formData = new FormData(form);

    submitButton.disabled = true;
    submitButton.textContent = 'Публикую...';

    sendData(formData)
      .then(() => {
        closeForm();
        showMessage('success');
      })
      .catch(() => {
        closeForm();
        showMessage('error');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Опубликовать';
      });
  });
}

