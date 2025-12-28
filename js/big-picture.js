const COMMENTS_PER_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountElement = bigPicture.querySelector('.social__comment-count');

const commentsLoader = bigPicture.querySelector('.comments-loader');
let currentComments = [];
let commentsShown = 0;

const cancelButton = bigPicture.querySelector('.big-picture__cancel');

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(img);
  commentElement.appendChild(text);

  return commentElement;
};

const renderComments = () => {
  const fragment = document.createDocumentFragment();
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_STEP);

  if (commentsShown === 0) {
    socialComments.innerHTML = '';
  }

  commentsToShow.forEach((comment) => {
    fragment.appendChild(createComment(comment));
  });

  socialComments.appendChild(fragment);

  commentsShown += commentsToShow.length;

  const shownCountSpan = commentCountElement.querySelector('.social__comment-shown-count');
  const totalCountSpan = commentCountElement.querySelector('.social__comment-total-count');

  if (shownCountSpan) {
    shownCountSpan.textContent = commentsShown;
  } else {
    commentCountElement.innerHTML = `<span class="social__comment-shown-count">${commentsShown}</span> из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;
  }

  if (totalCountSpan) {
    totalCountSpan.textContent = currentComments.length;
  }

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const resetComments = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};

const checkCommentsLoaderVisibility = () => {
  if (currentComments.length <= COMMENTS_PER_STEP) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const openBigPicture = (pictureData) => {
  const { url, likes, description, comments } = pictureData;

  resetComments();

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;

  const socialCaption = bigPicture.querySelector('.social__caption');
  socialCaption.textContent = description;

  const totalCommentsElement = bigPicture.querySelector('.social__comment-total-count');
  if (totalCommentsElement) {
    totalCommentsElement.textContent = comments.length;
  }

  currentComments = comments;

  renderComments();
  checkCommentsLoaderVisibility();

  commentCountElement.classList.remove('hidden');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

cancelButton.addEventListener('click', () => {
  closeBigPicture();
});

commentsLoader.addEventListener('click', onCommentsLoaderClick);

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
});

export { openBigPicture, closeBigPicture };
