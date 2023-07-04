install:
	npm ci

lint:
	npx eslint .

develop:
	NODE_ENV=development npx webpack serve

build-dev:
	NODE_ENV=development npx webpack

build:
	NODE_ENV=production npx webpack