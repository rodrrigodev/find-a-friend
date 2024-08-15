import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'

interface CreateOrganizationUseCaseRequest {
  responsible_name: string
  email: string
  password: string
  cep: string
  street: string
  whatsAap: string
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    responsible_name,
    email,
    password,
    whatsAap,
    cep,
    street,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const passwordHash = await hash(password, 6)

    const organization = await this.organizationsRepository.create({
      responsible_name,
      email,
      password: passwordHash,
      whatsAap,
      cep,
      street,
    })

    return { organization }
  }
}
