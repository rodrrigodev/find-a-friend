import { Pet, Prisma } from '@prisma/client'
import { RegisterPetRepository } from '../register-pet-repository'
import { randomUUID } from 'crypto'

export class InMemoryRegisterPet implements RegisterPetRepository {
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
}
