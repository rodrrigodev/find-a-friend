import { makeGetOrganizationDetailsUseCase } from '@/use-cases/factories/make-get-organization-details'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getOrganizationDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getOrganizationDetails = makeGetOrganizationDetailsUseCase()

  const { organization } = await getOrganizationDetails.execute(
    request.user.sub,
  )

  return reply
    .status(200)
    .send({ organization: { ...organization, password: undefined } })
}
