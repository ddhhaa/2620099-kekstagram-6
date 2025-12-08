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
let slider;

// Объявляем ВСЕ переменные в начале
const imageElement = document.querySelector('.img-upload__preview img');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectsList = document.querySelector('.effects__list');
// Добавляем контейнер здесь
const effectLevelContainer = document.querySelector('.effect-level');

const applyEffect = (value) => {
  if (currentEffect === DEFAULT_EFFECT) {
    imageElement.style.filter = 'none';
    return;
  }

  const { filter, unit } = EFFECTS[currentEffect];
  imageElement.style.filter = `${filter}(${value}${unit})`;
};

// Показать/скрыть слайдер
const showSlider = () => {
  effectLevelContainer.classList.remove('hidden');
};

const hideSlider = () => {
  effectLevelContainer.classList.add('hidden');
};

// Инициализация слайдера
const initSlider = () => {
  if (!slider) {
    slider = noUiSlider.create(effectLevelSlider, {
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1,
      connect: 'lower'
    });

    slider.on('update', () => {
      const value = slider.get();
      effectLevelValue.value = value;
      applyEffect(value);
    });
  }
};

// Сброс эффекта к значениям по умолчанию
const resetEffects = () => {
  currentEffect = DEFAULT_EFFECT;
  effectLevelValue.value = '100';

  if (slider) {
    slider.updateOptions({
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1
    });
  }

  applyEffect('100');
  hideSlider();
};

// Обновление слайдера при изменении эффекта
const updateSlider = (effect) => {
  if (effect === DEFAULT_EFFECT) {
    hideSlider();
    return;
  }

  const { min, max, step } = EFFECTS[effect];

  slider.updateOptions({
    range: {
      min,
      max
    },
    start: max,
    step
  });

  showSlider();
};

const onEffectChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = evt.target.value;
  updateSlider(currentEffect);
  applyEffect(EFFECTS[currentEffect].max);
  effectLevelValue.value = EFFECTS[currentEffect].max;
};

const initEffects = () => {
  initSlider();
  effectsList.addEventListener('change', onEffectChange);
  hideSlider();
};

const destroyEffects = () => {
  if (slider) {
    slider.destroy();
    slider = null;
  }
  effectsList.removeEventListener('change', onEffectChange);
  resetEffects();
};

export { initEffects, destroyEffects, resetEffects };
