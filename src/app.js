import axios from 'axios';
import { setLocale, string } from 'yup';
import onChange from 'on-change';
import { uniqueId } from 'lodash';
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
  readablePostsId: null,
  viewedPostsId: new Set(),
  feeds: [],
};

const state = onChange(initialState, view(elements, initialState, textState));

const proxy = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const validateUrl = (url, urls) => {
  setLocale({
    string: {
      url: 'err_invalidUrl',
    },
    mixed: {
      notOneOf: 'err_existRss',
      required: 'err_emptyField',
    },
  });

  const schema = string().required().url().notOneOf(urls);

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
        axios.get(proxy(url))
          .then((response) => {
            try {
              const { feed, posts } = parser(response.data.contents);
              const feedId = uniqueId();
              state.feeds.push({
                feedId,
                url,
                ...feed,
              });
              state.posts.push(...posts.map((post) => ({
                feedId,
                postId: uniqueId(),
                ...post,
              })));
              state.urls.push(url);
              state.form.state = 'success';
              state.form.fields.url = '';
            } catch (err) {
              state.form.error = new Error(textState.t('err_invalidRss'));
              state.form.state = 'filling';
              console.error(err);
            }
            state.form.error = null;
          })
          .catch((err) => {
            state.form.error = new Error(textState.t('err_network'));
            state.form.state = 'error';
            console.error(err);
          });
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const { id } = e.target.dataset;
      state.viewedPostsId.add(id);
      state.readablePostsId = id;
    }
  });
};
