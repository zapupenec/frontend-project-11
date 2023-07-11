[![Actions Status](https://github.com/zapupenec/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/zapupenec/frontend-project-11/actions)
[![CI](https://github.com/zapupenec/frontend-project-11/actions/workflows/mainCI.yml/badge.svg)](https://github.com/zapupenec/frontend-project-11/actions/workflows/mainCI.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/893498d46128da2a4789/maintainability)](https://codeclimate.com/github/zapupenec/frontend-project-11/maintainability)

EN | [RU](https://github.com/zapupenec/frontend-project-11/blob/main/README-ru.md)

# [RSS reader](https://frontend-project-11-zapupenec.vercel.app)
A service for aggregating RSS feeds, with which it is convenient to read a variety of sources, such as blogs. It allows you to add an unlimited number of RSS feeds, updates them itself and adds new entries to the general feed.
![screenshot-ru](/image/RSS_reader-ru.png)

<p>
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/html5" target="_blank" rel="noreferrer">
    <img src="./image/icon/html5.svg" width="36" height="36" alt="HTML5" title="HTML5"/>
  </a>
  <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">
    <img src="./image/icon/bootstrap5.svg" width="36" height="36" alt="Bootstrap" title="Bootstrap"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
    <img src="./image/icon/js.svg" width="36" height="36" alt="JavaScript" title="JavaScript"/>
  </a>
  <a href="https://webpack.js.org/" target="_blank" rel="noreferrer">
      <img src="./image/icon/webpack.svg" width="36" height="36" alt="webpack" title="webpack"/>
  </a>
  <a href="https://lodash.com" target="_blank" rel="noreferrer">
    <img src="./image/icon/lodash.svg" width="36" height="36" alt="Lodash" title="Lodash"/>
  </a>
  </a>
    <a href="https://www.i18next.com" target="_blank" rel="noreferrer">
    <img src="./image/icon/i18next.svg" width="36" height="36" alt="i18next" title="i18next"/>
  </a>
  </a>
    <a href="https://axios-http.com" target="_blank" rel="noreferrer">
    <img src="./image/icon/axios.svg" width="36" height="36" alt="Axios" title="Axios"/>
  </a>
  </a>
    </a>
    <a href="https://github.com/jquense/yup" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/yup-green" height="36" alt="yup" title="yup"/>
  </a>
  </a>
  </a>
    <a href="https://github.com/sindresorhus/on-change" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/🦄-on--change-green"height="36" alt="on-change" title="on-change"/>
  </a>
</p>

## Install for development
Developed using Node.js v20.4.0.

Clone the repository locally and install the dependencies.
```
make install
```
Start local server.
```
make develop
```
Build for development.
```
make build-dev
```
Build for production.
```
make build
```