import { prisma, PrismaClientKnownRequestError } from '@dpin-uptime/store'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { Router } from 'express'

const router = Router()

router.use('/website', authMiddleware)

router.post('/website', async (req, res) => {
  try {
    const { url } = req.body

    const website = await prisma.website.create({
      data: {
        url,
        userId: req.user.id,
      },
    })

    if (!website) {
      throw new Error('Website creation failed')
    }

    res.status(201).send('Website entry successfully created')
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).send('Website entry already exists')
        return
      }
    }
    throw error
  }
})

router.get('/website/status', async (req, res) => {
try {
 const websiteId = req.query['id']! as string 
 const ticks = await prisma.website.findMany({
    where: {
      id:websiteId ,
      archived:false,
      userId: req.user!.id
      },
      select: {
        url: true,
        websiteTicks:true
      }
  })


  res.status(200).json({ticks})

  }  catch (error) {
  throw error 
}

})

router.get('/website', async (req, res) => {
  try {
// const websiteId = req.query[]
    

   const websites = await prisma.website.findMany({
      where: {
        userId: req.user!.id,
        archived: false,

      }
    })

    res.status(200).json({websites})
  } catch (error) {
   throw error 
  }
})

router.delete('/website', async (req, res) => {
  try {
  const {websiteId }= req.body;

    const website = await prisma.website.update({
      where: {
        id:websiteId,
        archived:false,
        userId : req.user!.id
      },
      data: {
        archived: true
      }
    })

if(!website){
      throw new Error('Failed to delete website')
    }

    res.status(200).send('Website delete successfully')
  } catch (error) {
    throw error
  }
})

export { router as websiteRouter }
