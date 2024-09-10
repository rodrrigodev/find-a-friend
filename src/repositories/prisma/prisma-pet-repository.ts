import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PetFilters, PetRepository } from '../pet-repository'

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }

  async filterPet(petFilters: PetFilters) {
    const { age, category, energy, independence, size, state } = petFilters

    const pets = await prisma.pet.findMany({
      where: {
        age,
        category,
        energy,
        independence,
        size,
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
