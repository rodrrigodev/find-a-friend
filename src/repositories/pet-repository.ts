import { Pet, Prisma } from '@prisma/client'

export interface PetFilters {
  age?: string
  energy?: string
  size?: string
  independence?: string
  category?: string
  state: string
}

export interface PetRepository {
  create: (data: Prisma.PetUncheckedCreateInput) => Promise<Pet>
  filterPet: (filters: PetFilters) => Promise<Pet[] | null>
  findPetById(id: string): Promise<Pet | null>
}
