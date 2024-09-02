import { create } from '@/http/controllers/organization/create-organization'
import { verifyJWT } from '@/middleware/verifyJWT'
import { FastifyInstance } from 'fastify'
import { getOrganizationDetails } from './get-organization-details'
import { authenticate } from './authenticate'

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organization', { onRequest: [verifyJWT] }, create)

  app.post('/create-session', authenticate)

  app.get('/organization-details', getOrganizationDetails)
}
