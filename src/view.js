import onChange from 'on-change';

import {
  renderCard,
  renderFeedback,
  renderPreview,
} from './renders.js';

export default (elements, state, textState) => {
  const handleProcessState = (processState) => {
    switch (processState) {
      case 'error':
        renderFeedback(elements, state, textState, state.form.error);
        elements.input.disabled = false;
        elements.submit.disabled = false;
        elements.input.focus();
        break;

      case 'sending':
        renderFeedback(elements, state, textState, state.form.error);
        elements.submit.disabled = true;
        elements.input.disabled = true;
        break;

      case 'success':
        renderFeedback(elements, state, textState, state.form.error);
        elements.input.disabled = false;
        elements.submit.disabled = false;
        elements.form.reset();
        elements.input.focus();
        break;

      default:
        throw new Error(`Unknown process ${process}`);
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(value);
        break;
      case 'feeds':
      case 'posts':
        renderCard(elements, state, textState, value);
        break;
      case 'viewedPostsId':
        renderCard(elements, state, textState, state.posts);
        break;
      case 'readablePostsId':
        renderPreview(state, value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
