import { PetNotFoundError } from '@/use-cases/errors/pet-not-found-error'
import { makeFilterPetUseCase } from '@/use-cases/factories/make-filter-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function filterPet(request: FastifyRequest, reply: FastifyReply) {
  const filterPetSchema = z.object({
    age: z.string().nullable(),
    energy: z.string().nullable(),
    size: z.string().nullable(),
    independence: z.string().nullable(),
    category: z.string().nullable(),
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
      console.log(err)
      reply.status(409).send({ message: err.message })
    }
  }
}
