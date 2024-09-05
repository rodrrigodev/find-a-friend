import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'
import { FilterPetUseCase } from '../filter-pet'

export function makeFilterPetUseCase() {
  const petRepository = new PrismaPetRepository()

  const useCase = new FilterPetUseCase(petRepository)

  return useCase
}
