import { makeCreateOrganizationUseCase } from '@/use-cases/factories/make-create-organization'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const organizationSchema = z.object({
    responsibleName: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string().min(8),
    street: z.string(),
    whatsAap: z.string().min(12),
  })

  const { responsibleName, email, password, whatsAap, cep, street } =
    organizationSchema.parse(request.body)

  const createOrganizationUseCase = makeCreateOrganizationUseCase()

  await createOrganizationUseCase.execute({
    responsible_name: responsibleName,
    email,
    password,
    whatsAap,
    cep,
    street,
  })

  return reply.status(201).send()
}
