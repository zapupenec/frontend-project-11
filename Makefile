install:
	npm ci

lint:
	npx eslint .

develop:
	npx webpack serve

build-dev:
	npx webpack

build:
	NODE_ENV=production npx webpack