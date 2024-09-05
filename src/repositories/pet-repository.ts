import { Pet, Prisma } from '@prisma/client'

export interface PetFilters {
  age: string | null
  energy: string | null
  size: string | null
  independence: string | null
  category: string | null
  state: string
}

export interface PetRepository {
  create: (data: Prisma.PetUncheckedCreateInput) => Promise<Pet>
  filterPet: (filters: PetFilters) => Promise<Pet[] | null>
  findPetById(id: string): Promise<Pet | null>
}
