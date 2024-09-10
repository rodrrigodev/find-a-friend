import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPet } from '@/repositories/in-memory/in-memory-pet'
import { FilterPetUseCase } from './filter-pet'
import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { PetNotFoundError } from './errors/pet-not-found-error'

let registerPetRepository: InMemoryPet
let organizationRepository: InMemoryOrganizationRepository
let sut: FilterPetUseCase

describe('Filter pet use case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    registerPetRepository = new InMemoryPet(organizationRepository)
    sut = new FilterPetUseCase(registerPetRepository)
  })

  it('should be able to filter pets', async () => {
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

    await registerPetRepository.create({
      organization_id: 'org-1',
      name: 'Luna',
      about: 'Uma gata curiosa e carinhosa.',
      category: 'Gato',
      age: '2',
      size: 'Small',
      energy: 'Medium',
      independence: 'Lot',
      environment: 'Spacious',
      requirements: ['Brinquedos interativos', 'Arranhador'],
    })

    const pet = await sut.execute({
      category: 'Gato',
      size: 'Small',
      energy: 'Medium',
      state: 'São Paulo',
    })

    const [firstPet] = pet!

    expect(pet).toHaveLength(1)
    expect(firstPet.name).toBe('Luna')
  })

  it('should not be able to filter pets', async () => {
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

    registerPetRepository.create({
      organization_id: 'org-1',
      name: 'Buddy',
      about: 'Um cachorro amigável e energético.',
      category: 'Cachorro',
      age: '3',
      size: 'Medium',
      energy: 'Big',
      independence: 'Little',
      environment: 'Modular',
      requirements: ['Quintal cercado', 'Exercício diário'],
    })

    await expect(() =>
      sut.execute({
        size: 'Medium',
        energy: '3',
        state: 'Minas Gerais',
      }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })
})
