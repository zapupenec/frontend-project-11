export default () => {
  const helloEl = document.createElement('h1');
  helloEl.textContent = 'Hello World!';
  document.body.append(helloEl);
};
