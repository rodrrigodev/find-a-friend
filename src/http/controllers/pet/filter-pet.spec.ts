import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Filter pets e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to filter pets', async () => {
    const pet = await request(app.server)
      .get('/filter-pet')
      .send({
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
