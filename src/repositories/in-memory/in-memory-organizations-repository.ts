import { Organization, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { PrismaOrganizationRepository } from '../prisma/prisma-organization-repository'

export class InMemoryOrganizationRepository
  implements PrismaOrganizationRepository
{
  public items: Organization[] = []

  async findByEmail(email: string) {
    const organizationWithSameEmail = this.items.find(
      (item) => item.email === email,
    )

    if (!organizationWithSameEmail) {
      return null
    }

    return organizationWithSameEmail
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = {
      id: data.id || randomUUID().toString(),
      responsible_name: data.responsible_name,
      email: data.email,
      password: await hash(data.password, 6),
      cep: data.cep,
      state: data.state,
      street: data.street,
      whatsApp: data.whatsApp,
      created_at: new Date(),
    }

    this.items.push(organization)

    return organization
  }

  async findOrganizationById(id: string) {
    const organization = this.items.find((org) => {
      return org.id === id
    })

    return organization || null
  }
}
