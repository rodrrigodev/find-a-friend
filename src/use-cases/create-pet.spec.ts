import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryPet } from '@/repositories/in-memory/in-memory-pet'
import { PetUseCase } from './create-pet'

let registerPetRepository: InMemoryPet
let organizationRepository: InMemoryOrganizationRepository
let sut: PetUseCase

describe('Create organization use case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    registerPetRepository = new InMemoryPet(organizationRepository)
    sut = new PetUseCase(registerPetRepository, organizationRepository)
  })

  it('should be able to register a new pet', async () => {
    const organization = await organizationRepository.create({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      state: 'São Paulo',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const { pet } = await sut.execute({
      organization_id: organization.id,
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

    expect(pet.name).toBe('Buddy')
    expect(pet.requirements).toHaveLength(1)
  })

  it('should not be able to register a new pet', async () => {
    await organizationRepository.create({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      state: 'São Paulo',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    await expect(() =>
      sut.execute({
        organization_id: 'org-01',
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Medium',
        energy: '3',
        independence: 'Little',
        environment: 'Modular',
        requirements: ['Quintal cercado', 'Exercício diário'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
