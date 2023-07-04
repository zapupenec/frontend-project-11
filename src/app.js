import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';
import resources from './locales/index.js';

import view from './view.js';

const textState = i18n.createInstance();
await textState.init({
  lng: 'ru',
  resources,
});

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('[type=url-input]'),
  submit: document.querySelector('[aria-label=add]'),
  feedbackEl: document.querySelector('.feedback'),
  postsContainer: document.querySelector('.posts'),
  feedsContainer: document.querySelector('.feeds'),
};

const initialState = {
  form: {
    state: 'filling', // sending, error, success
    error: null,
    fields: {
      url: '',
    },
    processError: null,
  },
  posts: [],
  feeds: ['https://ru.hexlet.io/lessons.rss'],
};

const state = onChange(initialState, view(elements, initialState));
const validateUrl = (url, urls) => {
  yup.setLocale({
    string: {
      url: 'err_invalidUrl',
    },
    mixed: {
      notOneOf: 'err_existRss',
    },
  });

  const schema = yup.string().url().notOneOf(urls);

  return schema.validate(url)
    .then(() => null)
    .catch((error) => textState.t(error.message));
};

export default () => {
  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.form.fields.url = value.trim();
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateUrl(state.form.fields.url, state.feeds)
      .then((error) => {
        state.form.error = error;
      });
  });
};
