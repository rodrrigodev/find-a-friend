import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  const organization = await prisma.organization.create({
    data: {
      email: 'pet-friend@email.com',
      password: await hash('123456', 6),
      responsible_name: 'Bruno',
      whatsApp: '121234567895',
      cep: '11689896',
      state: 'São Paulo',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    },
  })

  const authResponse = await request(app.server).post('/create-session').send({
    email: 'pet-friend@email.com',
    password: '123456',
  })

  const { token } = authResponse.body
  const { id } = organization

  return { token, id }
}
