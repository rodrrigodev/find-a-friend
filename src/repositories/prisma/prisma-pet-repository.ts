import { Prisma } from '@prisma/client'
import { prisma } from '@/utils/prisma'
import { PetFilters, PetRepository } from '../pet-repository'

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }

  async filterPet(filters: PetFilters) {
    const { age, category, energy, independence, size, state } = filters

    const pets = await prisma.pet.findMany({
      where: {
        age: age || '',
        category: category || '',
        energy: energy || '',
        independence: independence || '',
        size: size || '',
        AND: { organization: { state } },
      },
    })

    return pets
  }

  async findPetById(id: string) {
    const pet = await prisma.pet.findUnique({ where: { id } })

    return pet
  }
}
