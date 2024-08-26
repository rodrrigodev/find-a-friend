import { PetRepository } from '@/repositories/pet-repository'
import { PetFilters } from '../repositories/pet-repository'
import { PetsNotFound } from './errors/pets-not-found-error'

export class FilterPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ age, category, energy, independence, size }: PetFilters) {
    const pets = await this.petRepository.filterPet({
      age,
      category,
      energy,
      independence,
      size,
    })

    if (pets?.length === 0) {
      throw new PetsNotFound()
    }
    return pets
  }
}
