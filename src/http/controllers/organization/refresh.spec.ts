import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh token e2e test', () => {
  beforeAll(async () => await app.ready())

  afterAll(async () => await app.close())

  it('should be able to authenticate', async () => {
    await request(app.server).post('/organization').send({
      email: 'pet-friend@email.com',
      password: '123456',
      responsibleName: 'Bruno',
      whatsApp: '121234567895',
      cep: '11689896',
      state: 'São Paulo',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const authResponse = await request(app.server)
      .post('/create-session')
      .send({
        email: 'pet-friend@email.com',
        password: '123456',
      })

    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies Error')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
