import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRegisterPet } from '@/repositories/in-memory/in-memory-register-pet'
import { RegisterPetUseCase } from './register-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let registerPetRepository: InMemoryRegisterPet
let organizationRepository: InMemoryOrganizationRepository
let sut: RegisterPetUseCase

describe('Create organization use case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    registerPetRepository = new InMemoryRegisterPet()
    sut = new RegisterPetUseCase(registerPetRepository, organizationRepository)
  })

  it('should be able to register a new pet', async () => {
    const organization = await organizationRepository.create({
      email: 'pet-friend@email.com',
      password: '123456',
      responsible_name: 'Bruno',
      whatsApp: '12123456789',
      cep: '11689896',
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    const { pet } = await sut.execute({
      organization_id: organization.id,
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
      street: 'Rua nova vida, 123, Campinas, São Paulo - SP',
    })

    await expect(() =>
      sut.execute({
        organization_id: 'org-01',
        name: 'Buddy',
        about: 'Um cachorro amigável e energético.',
        category: 'Cachorro',
        age: '3',
        size: 'Médio',
        energy: 'Alta',
        independence: 'Baixa',
        environment: 'Casa com quintal',
        requirements: ['Quintal cercado', 'Exercício diário'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
