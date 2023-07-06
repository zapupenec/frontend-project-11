import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';

import resources from './locales/index.js';
import app from './app.js';

const textState = i18n.createInstance();
textState.init({
  lng: 'ru',
  resources,
})
  .then(() => {
    app(textState);
  });
