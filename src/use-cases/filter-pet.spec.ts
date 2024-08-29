import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPet } from '@/repositories/in-memory/in-memory-pet'
import { FilterPetUseCase } from './filter-pet'
import { PetsNotFoundError } from './errors/pet-not-found-error'
import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organizations-repository'

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
      size: 'Pequeno',
      energy: 'Média',
      independence: 'Alta',
      environment: 'Apartamento',
      requirements: ['Brinquedos interativos', 'Arranhador'],
    })

    const pet = await sut.execute({
      category: 'Gato',
      size: 'Pequeno',
      energy: 'Média',
      state: 'São Paulo',
    })

    const [firstPet] = pet!

    expect(pet).toHaveLength(1)
    expect(firstPet.name).toBe('Luna')
  })

  it('should be not able to filter pets', async () => {
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
      size: 'Médio',
      energy: 'Alta',
      independence: 'Baixa',
      environment: 'Casa com quintal',
      requirements: ['Quintal cercado', 'Exercício diário'],
    })

    await expect(() =>
      sut.execute({
        size: 'Médio',
        energy: 'Alta',
        state: 'Minas Gerais',
      }),
    ).rejects.toBeInstanceOf(PetsNotFoundError)
  })
})
