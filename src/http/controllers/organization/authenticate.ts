import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateSchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { organization } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = reply.jwtSign({}, { sign: { sub: organization.id } })

    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
