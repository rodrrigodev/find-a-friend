import { Organization } from '@prisma/client'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { OrganizationRepository } from '@/repositories/organization-repository'

interface OrganizationUseCaseRequest {
  responsible_name: string
  email: string
  password: string
  cep: string
  state: string
  street: string
  whatsApp: string
}

interface OrganizationUseCaseResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationRepository) {}

  async execute({
    responsible_name,
    email,
    password,
    whatsApp,
    cep,
    street,
    state,
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
      state,
    })

    return { organization }
  }
}
