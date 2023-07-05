export default (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const nodeError = doc.querySelector('parsererror');

  if (nodeError) {
    const parserError = nodeError.textContent;
    throw new Error(parserError);
  }

  const feed = {
    titleFeed: doc.querySelector('channel title').textContent,
    description: doc.querySelector('channel description').textContent,
  };

  const posts = [...doc.querySelectorAll('item')]
    .map((itemEl) => ({
      titlePost: itemEl.querySelector('title').textContent,
      link: itemEl.querySelector('link').textContent,
    }));

  return { feed, posts };
};
