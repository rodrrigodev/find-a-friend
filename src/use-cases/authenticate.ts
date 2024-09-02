import { Organization } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { OrganizationRepository } from '@/repositories/organization-repository'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  organization: Organization
}

export class AuthenticateUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationRepository.findByEmail(email)

    if (!organization) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, organization.password)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return { organization }
  }
}
