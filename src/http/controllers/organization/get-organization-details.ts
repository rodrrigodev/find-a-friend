import { makeGetOrganizationDetailsUseCase } from '@/use-cases/factories/make-get-organization-details'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getOrganizationDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const organizationParamsSchema = z.object({
    organizationId: z.string().uuid(),
  })

  const { organizationId } = organizationParamsSchema.parse(request.params)

  const getOrganizationDetails = makeGetOrganizationDetailsUseCase()

  const { organization } = await getOrganizationDetails.execute(organizationId)

  return reply.status(200).send({ ...organization, password: undefined })
}
