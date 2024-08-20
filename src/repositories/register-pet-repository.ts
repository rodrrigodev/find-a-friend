import { Pet, Prisma } from '@prisma/client'

export interface RegisterPetRepository {
  create: (data: Prisma.PetCreateInput) => Promise<Pet | null>
}
