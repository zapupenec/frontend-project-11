import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';

import view from './view.js';

const validateUrl = (url, urls) => {
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf(urls, 'RSS уже существует');

  return schema.validate(url)
    .then(() => null)
    .catch((error) => error);
};

export default () => {
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
      response: {},
      processError: null,
    },
    posts: [],
    feeds: [],
  };

  const state = onChange(initialState, view(elements, initialState));

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.form.fields.url = value.trim();
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    validateUrl(state.form.fields.url, state.feeds)
      .then((error) => {
        state.form.error = error;
      });
  });
};
