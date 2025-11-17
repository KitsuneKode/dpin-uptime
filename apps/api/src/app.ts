import { errorHandlerMiddleware } from '@/middlewares/error-handler-middleware'
import { timingMiddleWare } from '@/middlewares/timing-middleware'
import { toNodeHandler, auth } from '@dpin-uptime/auth/server'
import { dashboardRouter } from './routes/dashboard-route'
import { incidentRouter } from './routes/incident-route'
import { websiteRouter } from './routes/monitor-route'
import { statusPageRouter } from './routes/status-page-route'
import { validatorRouter } from './routes/validator-route'
import { adminRouter } from './routes/admin-route'
// import { expressMiddleWare } from '@dpin-uptime/trpc'
import config from '@/utils/config'
import express from 'express'
import cors from 'cors'

const app = express()

const routers = [websiteRouter, dashboardRouter, incidentRouter, statusPageRouter, validatorRouter, adminRouter]

app.use(
  cors({
    origin: config.getConfig('frontendUrl'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
