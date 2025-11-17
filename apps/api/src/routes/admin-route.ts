import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { prisma } from '@dpin-uptime/store';

const router = Router();

/**
 * POST /api/v1/admin/validators
 * Register a new validator (creates validator with PENDING status)
 * This endpoint is public - no auth required for registration
 */
router.post('/admin/validators', async (req, res) => {
  try {
    const { publicKey, location, ip } = req.body;

    if (!publicKey || !location || !ip) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: publicKey, location, ip',
      });
      return;
    }

    // Check if validator already exists
    const existing = await prisma.validator.findUnique({
      where: { publicKey },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: 'Validator with this public key already exists',
      });
      return;
    }

    // Create validator with PENDING status
    const validator = await prisma.validator.create({
      data: {
        publicKey,
        location,
        ip,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      data: validator,
      message: 'Validator registration submitted. Waiting for approval.',
    });
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/v1/admin/validators
 * Get all validators with their status
 * Requires authentication
 */
router.get('/admin/validators', authMiddleware, async (req, res) => {
  try {
    const status = req.query.status as string | undefined;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const validators = await prisma.validator.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            websiteTicks: true,
            earnings: true,
            withdrawals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: validators.map(v => ({
        id: v.id,
        publicKey: v.publicKey,
        location: v.location,
        ip: v.ip,
        status: v.status,
        approvedAt: v.approvedAt,
        approvedBy: v.approvedBy,
        totalEarned: v.totalEarned,
        totalWithdrawn: v.totalWithdrawn,
        pendingBalance: v.pendingBalance,
        totalValidations: v._count.websiteTicks,
        totalEarnings: v._count.earnings,
        totalWithdrawals: v._count.withdrawals,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      })),
    });
  } catch (error) {
    throw error;
  }
});

/**
 * PATCH /api/v1/admin/validators/:id/approve
 * Approve a validator
 * Requires authentication
 */
router.patch('/admin/validators/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const validator = await prisma.validator.findUnique({
      where: { id },
    });

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      });
      return;
    }

    if (validator.status === 'APPROVED') {
      res.status(400).json({
        success: false,
        message: 'Validator is already approved',
      });
      return;
    }

    const updated = await prisma.validator.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Validator approved successfully',
    });
  } catch (error) {
    throw error;
  }
});

/**
 * PATCH /api/v1/admin/validators/:id/reject
 * Reject a validator
 * Requires authentication
 */
router.patch('/admin/validators/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const validator = await prisma.validator.findUnique({
      where: { id },
    });

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      });
      return;
    }

    const updated = await prisma.validator.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedBy: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Validator rejected',
    });
  } catch (error) {
    throw error;
  }
});

/**
 * PATCH /api/v1/admin/validators/:id/suspend
 * Suspend a validator
 * Requires authentication
 */
router.patch('/admin/validators/:id/suspend', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const validator = await prisma.validator.findUnique({
      where: { id },
    });

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      });
      return;
    }

    const updated = await prisma.validator.update({
      where: { id },
      data: {
        status: 'SUSPENDED',
        approvedBy: userId,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Validator suspended',
    });
  } catch (error) {
    throw error;
  }
});

/**
 * DELETE /api/v1/admin/validators/:id
 * Delete a validator (soft delete by setting status to REJECTED)
 * Requires authentication
 */
router.delete('/admin/validators/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const validator = await prisma.validator.findUnique({
      where: { id },
    });

    if (!validator) {
      res.status(404).json({
        success: false,
        message: 'Validator not found',
      });
      return;
    }

    // Soft delete by setting status to REJECTED
    await prisma.validator.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Validator deleted successfully',
    });
  } catch (error) {
    throw error;
  }
});

export { router as adminRouter };
