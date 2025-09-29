import { errorHandlerMiddleware } from '@/middlewares/error-handler-middleware'
import { timingMiddleWare } from '@/middlewares/timing-middleware'
import { toNodeHandler, auth } from '@dpin-uptime/auth/server'
import { websiteRouter } from './routes/website-route'
// import { expressMiddleWare } from '@dpin-uptime/trpc'
import config from '@/utils/config'
import express from 'express'
import cors from 'cors'

const app = express()

const routers = [websiteRouter]

app.use(
  cors({
    origin: config.getConfig('frontendUrl'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.all('/api/auth/*splat', timingMiddleWare, toNodeHandler(auth))

app.use('/api/*splat', timingMiddleWare)

// app.use('/api/trpc', expressMiddleWare)

app.use(express.json())

routers.forEach((router) => {
  app.use('/api/v1/', router)
})

app.all('/*splat', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
  })
})

app.use(errorHandlerMiddleware)

export default app
