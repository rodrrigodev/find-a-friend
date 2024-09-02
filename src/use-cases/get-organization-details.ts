import { OrganizationRepository } from '@/repositories/organization-repository'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'

export class GetOrganizationDetailsUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(id: string) {
    const organization =
      await this.organizationRepository.findOrganizationById(id)

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    return { organization }
  }
}
