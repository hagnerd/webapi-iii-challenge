const express = 'express';

const server = express();

server.use(logger);

server.get('/', (_req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, _res, next) {
  console.log(`${req.method} - ${req.url} - ${new Date()}`);

  next();
};

module.exports = server;
