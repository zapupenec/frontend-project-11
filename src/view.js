import onChange from 'on-change';

import { renderCard, renderFeedback, renderPreview } from './renders.js';

const handleProcessState = (elements, procesState) => {
  switch (procesState) {
    case 'waiting':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case 'sending':
      elements.submit.disabled = true;
      elements.input.disabled = true;
      break;

    case 'success':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      elements.form.reset();
      elements.input.focus();
      break;

    default:
      throw new Error(`Unknown process ${process}`);
  }
};

export default (elements, initialState, textState) => {
  const state = onChange(initialState, (path, value) => {
    switch (path) {
      case 'form.procesState':
        handleProcessState(elements, value);
        break;
      case 'form.error':
        renderFeedback(elements, state, textState, value);
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

  return state;
};
