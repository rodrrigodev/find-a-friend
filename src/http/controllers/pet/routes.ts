import { verifyJWT } from '@/middleware/verifyJWT'
import { FastifyInstance } from 'fastify'
import { createPet } from './create-pet'
import { filterPet } from './filter-pet'

export async function petRoutes(app: FastifyInstance) {
  app.post('/:organizationId/create-pet', { onRequest: [verifyJWT] }, createPet)

  app.get('/filter-pet', filterPet)
}
