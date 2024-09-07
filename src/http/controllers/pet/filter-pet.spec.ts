import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Filter pets e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to filter pets', async () => {
    const { id, token } = await createAndAuthenticateOrganization(app)

    await request(app.server)
      .post(`/${id}/create-pet`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Medium',
        energy: '1',
        independence: 'Baixa',
        environment: 'Modular',
        requirements: ['Quintal cercado', 'Exercício diário'],
      })

    const pet = await request(app.server)
      .get('/filter-pet')
      .query({
        size: 'Medium',
        energy: '1',
        state: null,
        age: null,
        category: null,
        independence: null,
      })
      .send()

    console.log(pet.body, 123)

    // expect(pet.status).toEqual(201)
  })
})
