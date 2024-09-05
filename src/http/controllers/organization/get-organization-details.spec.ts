import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get organization details e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to get organization details', async () => {
    const organizationCreated = await request(app.server)
      .post('/organization')
      .send({
        email: 'pet-friend@email.com',
        password: '123456',
        responsibleName: 'Bruno',
        whatsApp: '121234567895',
        cep: '11689896',
        state: 'São Paulo',
        street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
      })

    const { id } = organizationCreated.body.organization

    const organization = await request(app.server)
      .get(`/organization-details/${id}`)
      .send()

    expect(organization.status).toEqual(200)
    expect(organization.body.state).toBe('São Paulo')
  })
})
