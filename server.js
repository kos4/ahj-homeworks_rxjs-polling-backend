const http = require('http');
const Koa = require('koa');
const { faker } = require('@faker-js/faker');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

router.get('/messages/unread', async (ctx, next) => {
  const messages = faker.helpers.multiple(() => {
    return {
      "id": faker.string.uuid(),
      "from": faker.internet.email(),
      "subject": "Hello from " + faker.person.firstName(),
      "body": faker.lorem.paragraph(),
      "received": faker.number.int({ min: 1, max: Date.now() })
    }
  }, {
    count: faker.number.int({ min: 1, max: 10 }),
  });

  ctx.response.body = {
    "status": "ok",
    "timestamp": Date.now(),
    "messages": messages
  }
});

app.use((ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (Math.random() > 0.5) {
    ctx.response.status = 500;
  }

  next();
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);