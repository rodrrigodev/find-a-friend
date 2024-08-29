import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PetFilters, PetRepository } from '../pet-repository'
import { InMemoryOrganizationRepository } from './in-memory-organizations-repository'

export class InMemoryPet implements PetRepository {
  public items: Pet[] = []

  constructor(private organizationRepository: InMemoryOrganizationRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id || randomUUID().toString(),
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
    const { age, category, independence, energy, size, state } = filters

    const filteredOrganizations = this.organizationRepository.items.filter(
      (org) => {
        return org.state === state
      },
    )
    // console.log(this.organizationRepository.items)

    const filteredPets = this.items.filter((pet) => {
      const belongsToFilteredOrganization = filteredOrganizations.some(
        (org) => pet.organization_id === org.id,
      )

      return (
        belongsToFilteredOrganization &&
        (!age || pet.age === age) &&
        (!category || pet.category === category) &&
        (!independence || pet.independence === independence) &&
        (!energy || pet.energy === energy) &&
        (!size || pet.size === size)
      )
    })

    return filteredPets
  }

  async findPetById(id: string) {
    const pet = this.items.find((pet) => {
      return pet.id === id
    })

    return pet || null
  }
}
