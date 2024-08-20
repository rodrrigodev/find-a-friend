import { Prisma } from '@prisma/client'
import { RegisterPetRepository } from '../register-pet-repository'
import { prisma } from '@/utils/prisma'

export class PrismaRegisterPetRepository implements RegisterPetRepository {
  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }
}
