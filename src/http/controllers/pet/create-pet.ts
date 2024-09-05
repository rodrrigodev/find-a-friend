import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const petSchema = z.object({
    name: z.string(),
    about: z.string().nullable(),
    category: z.string().nullable(),
    age: z.string().nullable(),
    size: z.enum(['Small', 'Medium', 'Big']).nullable(),
    energy: z.enum(['1', '2', '3']).nullable(),
    independence: z.enum(['Little', 'Medium', 'Lot']),
    environment: z.enum(['Restricted', 'Spacious', 'Modular']).nullable(),
    requirements: z.array(z.string()),
  })

  const organizationIdSchema = z.object({ id: z.string().uuid() })

  const {
    about,
    age,
    category,
    energy,
    environment,
    independence,
    name,
    requirements,
    size,
  } = petSchema.parse(request.body)

  const { id } = organizationIdSchema.parse(request.params)

  const createPet = makeCreatePetUseCase()

  try {
    const pet = await createPet.execute({
      about,
      age,
      category,
      energy,
      environment,
      independence,
      name,
      requirements,
      size,
      organization_id: id,
    })

    return reply.status(201).send(pet)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(409).send({ message: err.message })
    }
  }
}
