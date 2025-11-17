import { prisma } from '@dpin-uptime/store'
import { Router } from 'express'

const router = Router()

/**
 * GET /api/v1/validator/:publicKey
 * Get validator information and stats by public key
 */
router.get('/validator/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params

    console.log(`Fetching info for validator: ${publicKey}`)
    const validator = await prisma.validator.findUnique({
      where: { publicKey },
      include: {
        earnings: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: {
            websiteTicks: true,
            earnings: true,
            withdrawals: true,
          },
        },
      },
    })

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        id: validator.id,
        publicKey: validator.publicKey,
        location: validator.location,
        ip: validator.ip,
        totalEarned: validator.totalEarned,
        totalWithdrawn: validator.totalWithdrawn,
        pendingBalance: validator.pendingBalance,
        totalValidations: validator._count.websiteTicks,
        totalEarnings: validator._count.earnings,
        totalWithdrawals: validator._count.withdrawals,
        recentEarnings: validator.earnings,
        recentWithdrawals: validator.withdrawals,
        createdAt: validator.createdAt,
        updatedAt: validator.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching validator:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch validator information',
    })
  }
})

/**
 * POST /api/v1/validator/:publicKey/withdraw
 * Request a withdrawal
 */
router.post('/validator/:publicKey/withdraw', async (req, res) => {
  try {
    const { publicKey } = req.params
    const { amount, walletAddress } = req.body

    if (!amount || !walletAddress) {
      res.status(400).json({
        success: false,
        message: 'Amount and wallet address are required',
      })
      return
    }

    const validator = await prisma.validator.findUnique({
      where: { publicKey },
    })

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      })
      return
    }

    // Check if validator has sufficient balance
    if (validator.pendingBalance < amount) {
      res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${validator.pendingBalance} SOL`,
      })
      return
    }

    // Create withdrawal request
    const withdrawal = await prisma.validatorWithdrawal.create({
      data: {
        validatorId: validator.id,
        amount,
        walletAddress,
        status: 'PENDING',
      },
    })

    // Update validator balance
    await prisma.validator.update({
      where: { id: validator.id },
      data: {
        pendingBalance: { decrement: amount },
        totalWithdrawn: { increment: amount },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: withdrawal,
    })
  } catch (error) {
    console.error('Error creating withdrawal:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create withdrawal request',
    })
  }
})

/**
 * GET /api/v1/validator/:publicKey/earnings
 * Get earnings history for a validator
 */
router.get('/validator/:publicKey/earnings', async (req, res) => {
  try {
    const { publicKey } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50

    const validator = await prisma.validator.findUnique({
      where: { publicKey },
    })

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      })
      return
    }

    const [earnings, total] = await Promise.all([
      prisma.validatorEarning.findMany({
        where: { validatorId: validator.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.validatorEarning.count({
        where: { validatorId: validator.id },
      }),
    ])

    res.status(200).json({
      success: true,
      data: earnings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching earnings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings',
    })
  }
})

/**
 * GET /api/v1/validator/:publicKey/withdrawals
 * Get withdrawal history for a validator
 */
router.get('/validator/:publicKey/withdrawals', async (req, res) => {
  try {
    const { publicKey } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50

    const validator = await prisma.validator.findUnique({
      where: { publicKey },
    })

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      })
      return
    }

    const [withdrawals, total] = await Promise.all([
      prisma.validatorWithdrawal.findMany({
        where: { validatorId: validator.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.validatorWithdrawal.count({
        where: { validatorId: validator.id },
      }),
    ])

    res.status(200).json({
      success: true,
      data: withdrawals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawals',
    })
  }
})

export { router as validatorRouter }
