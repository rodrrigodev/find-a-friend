import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetOrganizationDetailsUseCase } from './get-organization-details'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'

let organizationRepository: InMemoryOrganizationRepository
let sut: GetOrganizationDetailsUseCase

describe('Get organization details use case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new GetOrganizationDetailsUseCase(organizationRepository)
  })

  it('should be able to get organization details', async () => {
    await organizationRepository.create({
      id: 'org-1',
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      state: 'São Paulo',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const organization = await sut.execute('org-1')

    expect(organization?.responsible_name).toBe('Bruno')
    expect(organization?.id).toEqual(expect.any(String))
  })

  it('should not be able to get organization details', async () => {
    await organizationRepository.create({
      id: 'org-1',
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      state: 'São Paulo',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    await expect(() => sut.execute('org-15')).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    )
  })
})
