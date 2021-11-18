const conf = require('ocore/conf.js');
const fastify = require('fastify');
const CORS = require('fastify-cors');
const store = require('./store.js');

// Create instance
const fastifyInstance = fastify({ logger: false });

// CORS
fastifyInstance.register(CORS);

// Declare a route
fastifyInstance.get('/popular', async () => {
  const data = store.get();
  
  return { data }
})

// Run the server!
module.exports = async () => {
  try {
    await fastifyInstance.listen(conf.webserverPort);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
}