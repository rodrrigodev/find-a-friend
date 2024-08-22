import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { CreateOrganizationUseCase } from './create-organization'

let organizationsRepository: InMemoryOrganizationRepository
let sut: CreateOrganizationUseCase
describe('Create organization use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationRepository()
    sut = new CreateOrganizationUseCase(organizationsRepository)
  })

  it('should be able to create a new organization', async () => {
    const { organization } = await sut.execute({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should be able to hash the password', async () => {
    const { organization } = await sut.execute({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const passwordIsTheSame = await compare('123456', organization.password)

    expect(passwordIsTheSame).toBe(true)
  })

  it('should not be able to create a new organization', async () => {
    await sut.execute({
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
        password: '123456',
        responsible_name: 'Bruno',
        whatsApp: '12123456789',
        cep: '11689896',
        street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
