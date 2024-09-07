import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { organizationRoutes } from './http/controllers/organization/routes'
import { petRoutes } from './http/controllers/pet/routes'

export const app = fastify()

app.register(fastifyJwt, { secret: env.JWT_SECRET })
app.register(organizationRoutes)
app.register(petRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: '⚠️ Validation error', issues: error.format() })
  }

  if (env.NODE_ENV === 'development') {
    console.error(error)
  }

  reply.status(400).send({ message: '⚠️ Internal server error!' })
})
