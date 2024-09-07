import { verifyJWT } from '@/middleware/verifyJWT'
import { FastifyInstance } from 'fastify'
import { createPet } from './create-pet'
import { filterPet } from './filter-pet'
import { getPetDetails } from './get-pet-details'

export async function petRoutes(app: FastifyInstance) {
  app.post('/:organizationId/create-pet', { onRequest: [verifyJWT] }, createPet)

  app.get('/filter-pet', filterPet)

  app.get('/:petId/pet-details', getPetDetails)
}
