import { Prisma } from '@prisma/client'
import { prisma } from '@/utils/prisma'
import { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
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

  async findById(id: string) {
    const organization = await prisma.organization.findUnique({ where: { id } })

    return organization
  }
}
