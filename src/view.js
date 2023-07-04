import _ from 'lodash';

const renderError = (elements, error) => {
  if (!error) {
    elements.input.classList.remove('is-invalid');
    elements.feedbackEl.textContent = '';
    return;
  }

  elements.input.classList.add('is-invalid');
  elements.feedbackEl.textContent = error.message;
};

export default (elements, state) => (path, value) => {
  switch (path) {
    case 'form.error':
      renderError(elements, value);
      break;
    default:
      break;
  }
};
