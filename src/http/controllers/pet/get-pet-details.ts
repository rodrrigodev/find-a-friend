import { PetNotFoundError } from '@/use-cases/errors/pet-not-found-error'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getPetDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getPetSchema = z.object({
    petId: z.string(),
  })

  const { petId } = getPetSchema.parse(request.params)

  const getPetDetails = makeGetPetDetailsUseCase()

  try {
    const pet = await getPetDetails.execute(petId)

    return reply.status(200).send(pet)
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      reply.status(409).send({ message: err.message })
    }
  }
}
