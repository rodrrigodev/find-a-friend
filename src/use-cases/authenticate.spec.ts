import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let organizationsRepository: InMemoryOrganizationRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationRepository()
    sut = new AuthenticateUseCase(organizationsRepository)
  })

  it('should be able to authenticate', async () => {
    await organizationsRepository.create({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const { organization } = await sut.execute({
      email: 'pet-friend@email.com',
      password: '123456',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate', async () => {
    await organizationsRepository.create({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    await expect(() =>
      sut.execute({
        email: 'pet-friend@email.com',
        password: '123498',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
