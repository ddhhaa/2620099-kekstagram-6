const Urls = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram',
};

const getData = () =>
  fetch(Urls.GET)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      return response.json();
    });

const postData = (body) =>
  fetch(Urls.POST, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to send data');
      }
    });

export { getData, postData };
