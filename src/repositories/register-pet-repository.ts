import { Pet, Prisma } from '@prisma/client'

export interface RegisterPetRepository {
  create: (data: Prisma.PetUncheckedCreateInput) => Promise<Pet>
}
