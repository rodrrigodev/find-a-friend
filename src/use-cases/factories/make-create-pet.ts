import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'
import { PetUseCase } from '../create-pet'
import { PrismaOrganizationRepository } from '@/repositories/prisma/prisma-organization-repository'

export function makeCreatePetUseCase() {
  const petRepository = new PrismaPetRepository()
  const organizationsRepository = new PrismaOrganizationRepository()

  const useCase = new PetUseCase(petRepository, organizationsRepository)

  return useCase
}
