import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetRepository } from '@/repositories/pet-repository'
import { OrganizationRepository } from '@/repositories/organization-repository'

interface RegisterPetUseCaseRequest {
  organization_id: string
  name: string
  about: string | null
  category: string | null
  age: string | null
  size: string | null
  energy: string | null
  independence: string | null
  environment: string | null
  requirements: string[] | []
}

interface PetUseCaseResponse {
  pet: Pet
}

export class PetUseCase {
  constructor(
    private registerPetRepository: PetRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute(data: RegisterPetUseCaseRequest): Promise<PetUseCaseResponse> {
    const organization = await this.organizationRepository.findOrganizationById(
      data.organization_id,
    )

    if (!organization) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.registerPetRepository.create({
      organization_id: data.organization_id,
      name: data.name,
      about: data.about,
      category: data.category,
      age: data.age,
      size: data.size,
      energy: data.energy,
      independence: data.independence,
      environment: data.environment,
      requirements: data.requirements,
    })

    return { pet }
  }
}
