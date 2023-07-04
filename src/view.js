const handleProcessState = (elements, process) => {
  switch (process) {
    case 'filling':
      elements.input.disabled = false;
      elements.submit.disabled = false;
      break;

    case 'sending':
      elements.submit.disabled = true;
      elements.input.disabled = true;
      break;

    case 'error':
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

const renderFeedback = (elements, state, textState, error) => {
  if (state.form.state === 'success') {
    elements.input.classList.remove('is-invalid');
    elements.feedbackEl.classList.remove('text-danger');
    elements.feedbackEl.classList.add('text-success');
    elements.feedbackEl.textContent = textState.t('successMessage');
  } else {
    if (!error) {
      return;
    }
    elements.input.classList.add('is-invalid');
    elements.feedbackEl.classList.remove('text-success');
    elements.feedbackEl.classList.add('text-danger');
    elements.feedbackEl.textContent = error.message;
  }
};

export default (elements, state, textState) => (path, value) => {
  switch (path) {
    case 'form.state':
      handleProcessState(elements, value);
      break;
    case 'form.error':
      renderFeedback(elements, state, textState, value);
      break;
    default:
      break;
  }
};
