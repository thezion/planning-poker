# planning-poker

A simple game for estimating the relative size of tasks.

## Run with docker

```
docker run -d -t --name planning-poker -p 3001:3000 -v ${PWD}:/app node:12
```

## Play Online

[https://planning-poker.appsample.com](https://planning-poker.appsample.com)

## Deployment

Creating a new tag will trigger a pipeline to deploy the app automatically.
