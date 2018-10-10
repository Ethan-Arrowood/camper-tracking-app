/*
 * Camper Skill Tracking App Server
 * Created by @Ethan-Arrowood
 * */

/*
 * Initialize Fastify server instance based on
 * product/development environments.
 * 
 * TODO(@Ethan-Arrowood) : Set up production level
 * logging instance. Use Pino maybe?
 * */
const Fastify = require('fastify')
const fastify =
  process.env.NODE_ENV === 'production'
    ? Fastify()
    : Fastify({ logger: { prettyPrint: true } })

// Standard module imports
const path = require('path')

/*
 * Instantiate the Neo4j Graph Database driver
 * 
 * TODO(@Ethan-Arrowood) : use an env variable for url
 * 
 * TODO(@Ethan-Arrowood) : Figure out authentication
 * */
const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(
  'bolt://localhost',
  neo4j.auth.basic('neo4j', 'abc123!'),
  { disableLosslessIntegers: true }
)

const PORT = process.env.PORT || 8080

// Only serve the SPA when in production mode
if (process.env.NODE_ENV === 'production') {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'dist/'),
  })

  fastify.get('/', (request, reply) => {
    reply.sendFile('index.html')
  })
}

// Register API routes from subdirectory
fastify.register(require('./routes/api.js'), { prefix: '/api' })

/*
 * Add hook methods. These set up Neo4j sessions on request.
 * Skips '/' url 
 * 
 * TODO(@Ethan-Arrowood) : When auth sessions are set up have
 * the session be initiated per auth sess; not every request.
 * 
 * */
fastify.addHook('onRequest', (req, res, next) => {
  if (req.url === '/') next()
  try {
    if (fastify.hasRequestDecorator('n4jSession')) {
      req.n4jSession = driver.session()
    } else {
      fastify.decorateRequest('n4jSession', driver.session())
    }
  } catch (err) {
    fastify.log.error(err)
  }
  next()
})

fastify.addHook('onSend', (req, res, payload, next) => {
  if (req.url === '/') next()
  try {
    req.n4jSession.close()
  } catch (err) {
    fastify.log.error(err)
  }
  next()
})

fastify.addHook('onClose', (instance, done) => {
  if (driver) driver.close()
  done()
})

const start = async () => {
  try {
    await fastify.listen(PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    fastify.log.info(`\n ${fastify.printRoutes()}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
