import { Organization, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { OrganizationsRepository } from '../organizations-repository'
import { hash } from 'bcryptjs'

export class InMemoryOrganizationRepository implements OrganizationsRepository {
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
      id: randomUUID().toString(),
      responsible_name: data.responsible_name,
      email: data.email,
      password: await hash(data.password, 6),
      cep: data.cep,
      street: data.street,
      whatsApp: data.whatsApp,
      created_at: new Date(),
    }

    this.items.push(organization)

    return organization
  }

  async findById(id: string) {
    const organization = this.items.find((org) => {
      return org.id === id
    })

    return organization || null
  }
}
