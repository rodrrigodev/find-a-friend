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
    state: z.string().min(4),
    street: z.string(),
    whatsApp: z.string().min(12),
  })

  const { responsibleName, email, password, whatsApp, cep, street, state } =
    organizationSchema.parse(request.body)

  const passwordHash = await hash(password, 6)

  const createOrganizationUseCase = makeCreateOrganizationUseCase()

  try {
    const organization = await createOrganizationUseCase.execute({
      responsible_name: responsibleName,
      email,
      password: passwordHash,
      whatsApp,
      state,
      cep,
      street,
    })

    return reply.status(201).send(organization)
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
