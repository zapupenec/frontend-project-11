import axios from 'axios';
import { setLocale, string } from 'yup';
import { isEqual, uniqueId } from 'lodash';
import i18n from 'i18next';

import resources from './locales/index.js';
import parser from './parser.js';
import view from './view.js';

const proxifyUrl = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app');
  newUrl.pathname = '/get';
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl;
};

setLocale({
  string: {
    url: 'err_invalidUrl',
  },
  mixed: {
    notOneOf: 'err_existRss',
    required: 'err_emptyField',
  },
});

const validateUrl = (url, urls) => {
  const schema = string().required().url().notOneOf(urls);

  return schema.validate(url)
    .then(() => '')
    .catch((error) => error);
};

const updatePosts = (state) => {
  const getRequests = state.feeds.map(({ url }) => {
    const currentUrl = url;
    return axios.get(proxifyUrl(currentUrl))
      .then((response) => {
        const { posts } = parser(response.data.contents);
        // eslint-disable-next-line no-shadow
        const { feedId } = state.feeds.find(({ url }) => url === currentUrl);
        const filteredPosts = posts
          .filter((currentPost) => state.posts.some((post) => isEqual(post, currentPost)));
        state.posts.push(...filteredPosts.map((post) => ({
          feedId,
          postId: uniqueId(),
          ...post,
        })));
      })
      .catch((err) => {
        console.error(err);
      });
  });

  Promise.all(getRequests)
    .finally(() => {
      setTimeout(() => updatePosts(state), 5000);
    });
};

export default () => {
  const textState = i18n.createInstance();
  textState.init({
    lng: 'ru',
    resources,
  })
    .then(() => {
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
          state: 'waiting',
          error: null,
        },
        feeds: [],
        posts: [],
        readablePostsId: null,
        viewedPostsId: new Set(),
      };

      const watchedState = view(elements, initialState, textState);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const existUrls = watchedState.feeds.map(({ url }) => url);
        const formData = new FormData(elements.form);
        const url = formData.get('url').trim();
        watchedState.form.error = null;

        validateUrl(url, existUrls)
          .then((validationError) => {
            watchedState.form.state = 'sending';
            watchedState.form.error = validationError;
            if (validationError) {
              watchedState.form.state = 'waiting';
              return;
            }

            axios.get(proxifyUrl(url))
              .then((response) => {
                const { feed, posts } = parser(response.data.contents);
                const feedId = uniqueId();
                watchedState.feeds.push({
                  feedId,
                  url,
                  ...feed,
                });
                watchedState.posts.push(...posts.map((post) => ({
                  feedId,
                  postId: uniqueId(),
                  ...post,
                })));
                watchedState.form.state = 'success';
                watchedState.form.error = null;
              })
              .catch((err) => {
                if (err.isAxiosError) {
                  watchedState.form.error = new Error('err_network');
                } else {
                  watchedState.form.error = new Error('err_invalidRss');
                }
                console.error(err);
                watchedState.form.state = 'waiting';
              });
          });
      });

      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
          const { id } = e.target.dataset;
          watchedState.viewedPostsId.add(id);
          watchedState.readablePostsId = id;
        }
      });

      updatePosts(watchedState);
    });
};
