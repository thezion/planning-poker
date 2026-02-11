# planning-poker

A simple game for estimating the relative size of tasks.

## Local development

Requires **Node.js 20** (see `.nvmrc`). Use `nvm use` if you use nvm.

```bash
npm install
npm start
```

The app uses `NODE_OPTIONS=--openssl-legacy-provider` for `start` and `build` so it works with Node 18+ and the current tooling (Create React App 4 / webpack 4).

## Run with docker

```
docker run -d -t --name planning-poker -p 3001:3000 -v ${PWD}:/app node:20
```

## Play Online

[https://planning-poker.appsample.com](https://planning-poker.appsample.com)

## Deployment

Creating a new tag will trigger a pipeline to deploy the app automatically.
