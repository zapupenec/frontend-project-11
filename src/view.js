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
      elements.input.disabled = false;
      elements.submit.disabled = false;
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

const renderFeeds = (feeds) => {
  const itemElements = feeds.map(({ titleFeed, description }) => {
    const titleEl = document.createElement('h3');
    titleEl.className = 'h6 m-0';
    titleEl.textContent = titleFeed;

    const descriptionEl = document.createElement('p');
    descriptionEl.className = 'm-0 small text-black-50';
    descriptionEl.textContent = description;

    const itemEl = document.createElement('li');
    itemEl.className = 'list-group-item border-0 border-end-0';
    itemEl.append(titleEl, descriptionEl);
    return itemEl;
  });

  return itemElements;
};

const renderPreview = (state, id) => {
  const currentPost = state.posts.find((post) => post.postId === id);
  const { titlePost, description, link } = currentPost;
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = titlePost;
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = description;
  const linkToFullArticle = document.querySelector('.full-article');
  linkToFullArticle.setAttribute('href', `${link}`);
};

const renderPosts = (state, textState, posts) => {
  const itemElements = posts.map(({
    titlePost, link, postId,
  }) => {
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', `${link}`);
    linkEl.className = state.viewedPostsId.has(postId) ? 'fw-normal' : 'fw-bold';
    linkEl.setAttribute('data-id', `${postId}`);
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener noreferrer');
    linkEl.textContent = titlePost;

    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type', 'button');
    buttonEl.className = 'btn btn-outline-primary btn-sm';
    buttonEl.setAttribute('data-id', `${postId}`);
    buttonEl.setAttribute('data-bs-toggle', 'modal');
    buttonEl.setAttribute('data-bs-target', '#modal');
    buttonEl.textContent = textState.t('postButton');

    const itemEl = document.createElement('li');
    itemEl.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    itemEl.append(linkEl, buttonEl);
    return itemEl;
  });

  return itemElements;
};

const renderCard = (elements, state, textState, items) => {
  if (items.length === 0) {
    return;
  }
  const isFeed = Object.hasOwn(items[0], 'titleFeed');

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title h4';
  cardTitle.textContent = textState.t(isFeed ? 'feeds' : 'posts');

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  cardBody.append(cardTitle);

  const itemElements = isFeed ? renderFeeds(items) : renderPosts(state, textState, items);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  ulEl.append(...itemElements);

  const card = document.createElement('div');
  card.className = 'card border-0';
  card.append(cardBody, ulEl);

  const container = isFeed ? elements.feedsContainer : elements.postsContainer;
  container.textContent = '';
  container.append(card);
};

export default (elements, state, textState) => (path, value) => {
  switch (path) {
    case 'form.state':
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
};
