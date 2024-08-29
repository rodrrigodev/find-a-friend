import { PetRepository } from '@/repositories/pet-repository'
import { PetFilters } from '../repositories/pet-repository'
import { PetsNotFoundError } from './errors/pet-not-found-error'

export class FilterPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    age,
    category,
    energy,
    independence,
    size,
    state,
  }: PetFilters) {
    const pets = await this.petRepository.filterPet({
      age,
      category,
      energy,
      independence,
      size,
      state,
    })

    if (pets?.length === 0) {
      throw new PetsNotFoundError()
    }
    return pets
  }
}
