import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PetFilters, PetRepository } from '../pet-repository'

export class InMemoryPet implements PetRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID().toString(),
      name: data.name,
      about: data.about || null,
      category: data.category || null,
      age: data.age || null,
      size: data.size || null,
      energy: data.energy || null,
      independence: data.independence || null,
      environment: data.environment || null,
      requirements: [''],
      created_at: new Date(),
      organization_id: data.organization_id,
    }

    this.items.push(pet)

    return pet
  }

  async filterPet(filters: PetFilters) {
    const { age, category, independence, energy, size } = filters

    return this.items.filter((pet) => {
      return (
        (!age || pet.age === age) &&
        (!category || pet.category === category) &&
        (!independence || pet.independence === independence) &&
        (!energy || pet.energy === energy) &&
        (!size || pet.size === size)
      )
    })
  }
}
