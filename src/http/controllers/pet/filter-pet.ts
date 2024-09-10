import { PetNotFoundError } from '@/use-cases/errors/pet-not-found-error'
import { makeFilterPetUseCase } from '@/use-cases/factories/make-filter-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function filterPet(request: FastifyRequest, reply: FastifyReply) {
  const filterPetSchema = z.object({
    age: z.string().optional(),
    energy: z.string().optional(),
    size: z.string().optional(),
    independence: z.string().optional(),
    category: z.string().optional(),
    state: z.string(),
  })

  const { age, category, energy, independence, size, state } =
    filterPetSchema.parse(request.query)

  const filterPet = makeFilterPetUseCase()

  try {
    const pet = await filterPet.execute({
      age,
      category,
      energy,
      independence,
      size,
      state,
    })

    return reply.status(200).send(pet)
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      reply.status(409).send({ message: err.message })
    }
  }
}
