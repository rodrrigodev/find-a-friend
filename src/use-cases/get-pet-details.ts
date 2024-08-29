import { PetRepository } from '@/repositories/pet-repository'
import { PetsNotFoundError } from './errors/pet-not-found-error'

export class GetPetDetailsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(id: string) {
    const pet = await this.petRepository.findPetById(id)

    if (!pet) {
      throw new PetsNotFoundError()
    }

    return pet
  }
}
