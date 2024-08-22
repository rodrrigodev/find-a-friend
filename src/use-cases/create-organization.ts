import { Organization } from '@prisma/client'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { OrganizationsRepository } from '@/repositories/organizations-repository'

interface OrganizationUseCaseRequest {
  responsible_name: string
  email: string
  password: string
  cep: string
  street: string
  whatsApp: string
}

interface OrganizationUseCaseResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    responsible_name,
    email,
    password,
    whatsApp,
    cep,
    street,
  }: OrganizationUseCaseRequest): Promise<OrganizationUseCaseResponse> {
    const organizationAlreadyExists =
      await this.organizationsRepository.findByEmail(email)

    if (organizationAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const organization = await this.organizationsRepository.create({
      responsible_name,
      email,
      password,
      whatsApp,
      cep,
      street,
    })

    return { organization }
  }
}
