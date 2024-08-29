import { PrismaOrganizationRepository } from '@/repositories/prisma/prisma-organization-repository'
import { CreateOrganizationUseCase } from '../create-organization'

export function makeCreateOrganizationUseCase() {
  const organizationsRepository = new PrismaOrganizationRepository()
  const useCase = new CreateOrganizationUseCase(organizationsRepository)

  return useCase
}
