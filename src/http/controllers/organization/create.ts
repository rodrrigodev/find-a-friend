import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { makeCreateOrganizationUseCase } from '@/use-cases/factories/make-create-organization'
import { hash } from 'bcryptjs'
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

  const passwordHash = await hash(password, 6)

  const createOrganizationUseCase = makeCreateOrganizationUseCase()

  try {
    await createOrganizationUseCase.execute({
      responsible_name: responsibleName,
      email,
      password: passwordHash,
      whatsAap,
      cep,
      street,
    })
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
