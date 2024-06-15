import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'
import { ZodError } from 'zod'

const app = Fastify()

app.register(cors)
app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
      return reply.status(400).send({
          message: 'Validation error',
          issues: error.format()
      })
  }
})

app.listen({
  port:3333,
}).then(() => {
  console.log('TARGET ON!')
})