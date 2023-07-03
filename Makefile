develop:
	NODE_ENV=development npx webpack serve

install:
	npm ci

build:
	NODE_ENV=production npx webpack

build-dev:
	NODE_ENV=development npx webpack

lint:
	npx eslint .