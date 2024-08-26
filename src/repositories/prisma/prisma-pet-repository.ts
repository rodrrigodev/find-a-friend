import { Prisma } from '@prisma/client'
import { prisma } from '@/utils/prisma'
import { PetFilters, PetRepository } from '../pet-repository'

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }

  async filterPet(filters: PetFilters) {
    const { age, category, energy, independence, size } = filters

    const whereConditions = {
      ...(age && { age }),
      ...(category && { category }),
      ...(energy && { energy }),
      ...(independence && { independence }),
      ...(size && { size }),
    }

    const pets = await prisma.pet.findMany({
      where: whereConditions,
    })

    return pets
  }
}
