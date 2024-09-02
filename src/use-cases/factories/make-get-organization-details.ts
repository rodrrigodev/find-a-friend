import { PrismaOrganizationRepository } from '@/repositories/prisma/prisma-organization-repository'
import { GetOrganizationDetailsUseCase } from '../get-organization-details'

export function makeGetOrganizationDetailsUseCase() {
  const organizationsRepository = new PrismaOrganizationRepository()
  const useCase = new GetOrganizationDetailsUseCase(organizationsRepository)

  return useCase
}
