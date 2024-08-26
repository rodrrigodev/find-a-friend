import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPet } from '@/repositories/in-memory/in-memory-pet'
import { FilterPetUseCase } from './filter-pet'
import { PetsNotFound } from './errors/pets-not-found-error'

let registerPetRepository: InMemoryPet
let sut: FilterPetUseCase

describe('Filter pet use case', () => {
  beforeEach(() => {
    registerPetRepository = new InMemoryPet()
    sut = new FilterPetUseCase(registerPetRepository)
  })

  it('should be able to filter pets', async () => {
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

    registerPetRepository.create({
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
    })

    const [firstPet] = pet!

    expect(pet).toHaveLength(1)
    expect(firstPet.name).toBe('Luna')
  })

  it('should be not able to filter pets', async () => {
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
        category: 'Gato',
        size: 'Pequeno',
        energy: 'Média',
      }),
    ).rejects.toBeInstanceOf(PetsNotFound)
  })
})
