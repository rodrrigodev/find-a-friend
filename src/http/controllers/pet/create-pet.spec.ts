import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Create a pet e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to create a pet', async () => {
    const { id, token } = await createAndAuthenticateOrganization(app)

    const pet = await request(app.server)
      .post(`/${id}/create-pet`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Small',
        energy: '3',
        independence: 'Little',
        environment: 'Modular',
        requirements: ['Quintal cercado', 'Exercício diário'],
      })

    expect(pet.status).toEqual(201)
  })
})
