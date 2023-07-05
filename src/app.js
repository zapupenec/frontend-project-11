import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';
import resources from './locales/index.js';

import parser from './parser.js';
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
    fields: {
      url: '',
    },
    error: null,
  },
  urls: [],
  posts: [],
  feeds: [],
};

const state = onChange(initialState, view(elements, initialState, textState));

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
    .then(() => '')
    .catch((error) => new Error(textState.t(error.message)));
};

export default () => {
  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.form.fields.url = value.trim();
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateUrl(state.form.fields.url, state.urls)
      .then((error) => {
        state.form.state = 'sending';

        state.form.error = error;
        if (error) {
          state.form.state = 'filling';
          return;
        }

        const { url } = state.form.fields;
        const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

        axios.get(proxyUrl)
          .then((response) => {
            try {
              const { feed, posts } = parser(response.data.contents);
              const feedId = _.uniqueId();
              state.feeds.push({ feedId, ...feed });
              state.posts.push(...posts.map((post) => ({ feedId, postId: _.uniqueId(), ...post })));
              state.urls.push(url);
              state.form.state = 'success';
            } catch (err) {
              state.form.error = new Error(textState.t('err_invalidRss'));
              state.form.state = 'filling';
            }
            state.form.error = null;
            state.form.fields.url = '';
          })
          .catch(() => {
            state.form.error = new Error(textState.t('err_network'));
            state.form.state = 'error';
          });
      });
  });
};
