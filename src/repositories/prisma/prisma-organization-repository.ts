import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { OrganizationRepository } from '../organization-repository'

export class PrismaOrganizationRepository implements OrganizationRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({ data })

    return organization
  }

  async findByEmail(email: string) {
    const organizationExists = await prisma.organization.findUnique({
      where: { email },
    })

    return organizationExists
  }

  async findOrganizationById(id: string) {
    const organization = await prisma.organization.findUnique({ where: { id } })

    return organization
  }
}
