import fastify from 'fastify'
import { appRoutes } from './routes/appRoutes'

export const app = fastify()

app.register(appRoutes)
