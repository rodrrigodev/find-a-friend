import { GetPetDetailsUseCase } from '../get-pet-details'
import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'

export function makeGetPetDetailsUseCase() {
  const petRepository = new PrismaPetRepository()
  const useCase = new GetPetDetailsUseCase(petRepository)

  return useCase
}
