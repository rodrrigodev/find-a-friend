import { create } from '@/http/controllers/organization/create-organization'
import { FastifyInstance } from 'fastify'
import { getOrganizationDetails } from './get-organization-details'
import { authenticate } from './authenticate'
import { refresh } from './refresh'

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organization', create)

  app.post('/create-session', authenticate)

  app.get('/organization-details/:organizationId', getOrganizationDetails)

  app.patch('/token/refresh', refresh)
}
