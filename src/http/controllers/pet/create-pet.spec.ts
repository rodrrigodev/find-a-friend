import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create a pet e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to create a pet', async () => {
    const organization = await request(app.server).post('/organization').send({
      email: 'pet-friend@email.com',
      password: '123456',
      responsibleName: 'Bruno',
      whatsApp: '121234567895',
      cep: '11689896',
      state: 'São Paulo',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const pet = await request(app.server)
      .post('/:organizationId/create-pet')
      .send({
        organization_id: organization.body.id,
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Médio',
        energy: 'Alta',
        independence: 'Baixa',
        environment: 'Casa com quintal',
        requirements: ['Quintal cercado', 'Exercício diário'],
      })

    expect(organization.status).toEqual(201)
  })
})
