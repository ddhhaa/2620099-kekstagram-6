const EFFECTS = {
  none: { min: 0, max: 100, step: 1, unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' }
};

const DEFAULT_EFFECT = 'none';
let currentEffect = DEFAULT_EFFECT;
let slider = null;

const imageElement = document.querySelector('.img-upload__preview img');
const effectLevelValue = document.querySelector('.effect-level__value');
let effectLevelSlider = null;
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');


const applyEffect = (value) => {

  if (currentEffect === DEFAULT_EFFECT) {
    imageElement.style.filter = 'none';
    return;
  }

  const { filter, unit } = EFFECTS[currentEffect];
  imageElement.style.filter = `${filter}(${value}${unit})`;
};

const showSlider = () => {
  if (effectLevelContainer) {
    effectLevelContainer.classList.remove('hidden');
  }
};

const hideSlider = () => {
  if (effectLevelContainer) {
    effectLevelContainer.classList.add('hidden');
  }
};

const resetEffects = () => {
  currentEffect = DEFAULT_EFFECT;
  if (effectLevelValue) {
    effectLevelValue.value = '';
  }

  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }

  if (slider) {
    slider.destroy();
    slider = null;
  }

  if (imageElement) {
    imageElement.style.filter = 'none';
  }

  hideSlider();
};

const updateSlider = (effect) => {
  if (!effectLevelSlider) {
    effectLevelSlider = document.querySelector('.effect-level__slider');
    if (!effectLevelSlider) {
      return;
    }
  }

  if (effect === DEFAULT_EFFECT) {
    if (imageElement) {
      imageElement.style.filter = 'none';
    }
    if (effectLevelValue) {
      effectLevelValue.value = '';
    }

    if (slider) {
      slider.destroy();
      slider = null;
    }

    hideSlider();
    return;
  }

  showSlider();

  const { min, max, step } = EFFECTS[effect];

  if (slider) {
    slider.destroy();
    slider = null;
  }


  noUiSlider.create(effectLevelSlider, {
    range: { min, max },
    start: max,
    step,
    connect: 'lower'
  });

  slider = effectLevelSlider.noUiSlider;

  slider.on('update', () => {
    const value = Number(slider.get());
    if (effectLevelValue) {
      effectLevelValue.value = value;
    }
    applyEffect(value);
  });

  slider.set(max);
};

const onEffectChange = (evt) => {
  const effectItem = evt.target.closest('.effects__item');
  if (!effectItem) {
    return;
  }

  const input = effectItem.querySelector('input[type="radio"]');
  if (!input) {
    return;
  }

  currentEffect = input.value;
  updateSlider(currentEffect);
};

const initEffects = () => {
  if (!effectsList) {
    return;
  }

  effectsList.addEventListener('click', onEffectChange);

  const initSlider = () => {
    effectLevelSlider = document.querySelector('.effect-level__slider');
    if (effectLevelSlider) {
      resetEffects();
    }
  };

  const uploadOverlay = document.querySelector('.img-upload__overlay');
  if (uploadOverlay) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.target.classList.contains('hidden')) {
          initSlider();
        }
      });
    });

    observer.observe(uploadOverlay, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

};

const destroyEffects = () => {
  if (slider) {
    slider.destroy();
    slider = null;
  }
  if (effectsList) {
    effectsList.removeEventListener('click', onEffectChange);
  }
  resetEffects();
};

export { initEffects, destroyEffects, resetEffects };
