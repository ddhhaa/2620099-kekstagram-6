const PICTURES_COUNT = 10;
const imageFilters = document.querySelector('.img-filters');
const imageFiltersForm = document.querySelector('.img-filters__form');
const filterButtons = imageFiltersForm.querySelectorAll('.img-filters__button');

const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

let currentFilter = Filter.DEFAULT;
let pictures = [];

const showFilters = () => {
  imageFilters.classList.remove('img-filters--inactive');
};

const getRandomPhotos = (photos) => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, PICTURES_COUNT);
};

const getDiscussedPhotos = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = (photos) => {
  switch (currentFilter) {
    case Filter.RANDOM:
      return getRandomPhotos(photos);
    case Filter.DISCUSSED:
      return getDiscussedPhotos(photos);
    default:
      return photos;
  }
};

const setActiveButton = (button) => {
  filterButtons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');
};

const onFilterClick = (callback) => {
  imageFiltersForm.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    const filterId = evt.target.id;

    if (filterId === currentFilter) {
      return;
    }

    currentFilter = filterId;
    setActiveButton(evt.target);

    callback();
  });
};


const initFilters = (loadedPictures, renderCallback) => {
  pictures = loadedPictures;
  showFilters();

  onFilterClick(() => {
    const filteredPictures = applyFilter(pictures);
    renderCallback(filteredPictures);
  });
};

export { initFilters, applyFilter };
