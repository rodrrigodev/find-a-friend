import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Should be able to get pet details e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to get pet details', async () => {
    const { id, token } = await createAndAuthenticateOrganization(app)

    const petCreated = await request(app.server)
      .post(`/${id}/create-pet`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Medium',
        energy: '3',
        independence: 'Little',
        environment: 'Modular',
        requirements: ['Quintal cercado', 'Exercício diário'],
      })

    const { id: petId } = petCreated.body.pet

    const pet = await request(app.server).get(`/${petId}/pet-details`).send()

    expect(pet.status).toEqual(200)
    expect(pet.body.name).toBe('Buddy')
  })
})
