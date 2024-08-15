import { create } from '@/http/controllers/organization/create'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.post('/organization', create)
}
