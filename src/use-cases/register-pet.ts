import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { RegisterPetRepository } from '@/repositories/register-pet-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private registerPetRepository: RegisterPetRepository,
    private organizationRepository: OrganizationsRepository,
  ) {}

  async execute(
    data: RegisterPetUseCaseRequest,
  ): Promise<RegisterPetUseCaseResponse> {
    const organization = await this.organizationRepository.findById(
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
