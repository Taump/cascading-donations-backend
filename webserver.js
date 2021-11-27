const conf = require('ocore/conf.js');
const fastify = require('fastify');
const CORS = require('fastify-cors');
const fastifySensible = require('fastify-sensible');

const bannerController = require('./controllers/bannerController.js');
const popularController = require('./controllers/popularController.js');

// Create instance
const fastifyInstance = fastify({ logger: false });

// CORS
fastifyInstance.register(CORS);

// register error generator
fastifyInstance.register(fastifySensible);

// Declare a routes
fastifyInstance.get('/popular', popularController);
fastifyInstance.get('/banner', bannerController);

// Run the server
module.exports = async () => {
  try {
    await fastifyInstance.listen(conf.webserverPort);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
}