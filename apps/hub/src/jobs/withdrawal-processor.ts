import { prisma } from '@dpin-uptime/store';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// Configuration
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY; // Base58 encoded private key
const WITHDRAWAL_PROCESSING_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_RETRIES = 3;

/**
 * Process pending withdrawals automatically
 * This runs every hour and processes all PENDING withdrawals
 */
export class WithdrawalProcessor {
  private connection: Connection;
  private treasuryKeypair: Keypair | null = null;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');

    // Initialize treasury keypair if private key is provided
    if (TREASURY_PRIVATE_KEY) {
      try {
        const secretKey = Buffer.from(TREASURY_PRIVATE_KEY, 'base64');
        this.treasuryKeypair = Keypair.fromSecretKey(secretKey);
        console.log('[WithdrawalProcessor] Treasury wallet initialized:', this.treasuryKeypair.publicKey.toString());
      } catch (error) {
        console.error('[WithdrawalProcessor] Failed to initialize treasury keypair:', error);
      }
    } else {
      console.warn('[WithdrawalProcessor] TREASURY_PRIVATE_KEY not set - withdrawals will be simulated');
    }
  }

  /**
   * Start the automated withdrawal processing
   */
  start() {
    console.log('[WithdrawalProcessor] Starting automated withdrawal processing');
    console.log(`[WithdrawalProcessor] Processing interval: ${WITHDRAWAL_PROCESSING_INTERVAL / 1000 / 60} minutes`);

    // Process immediately on start
    this.processWithdrawals();

    // Then process every hour
    this.processingInterval = setInterval(() => {
      this.processWithdrawals();
    }, WITHDRAWAL_PROCESSING_INTERVAL);
  }

  /**
   * Stop the automated withdrawal processing
   */
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('[WithdrawalProcessor] Stopped automated withdrawal processing');
    }
  }

  /**
   * Process all pending withdrawals
   */
  async processWithdrawals() {
    console.log('[WithdrawalProcessor] Starting withdrawal batch processing...');

    try {
      // Get all pending withdrawals
      const pendingWithdrawals = await prisma.validatorWithdrawal.findMany({
        where: {
          status: 'PENDING',
        },
        include: {
          validator: true,
        },
        orderBy: {
          createdAt: 'asc', // Process oldest first
        },
      });

      if (pendingWithdrawals.length === 0) {
        console.log('[WithdrawalProcessor] No pending withdrawals to process');
        return;
      }

      console.log(`[WithdrawalProcessor] Found ${pendingWithdrawals.length} pending withdrawals`);

      // Process each withdrawal
      for (const withdrawal of pendingWithdrawals) {
        await this.processWithdrawal(withdrawal);
        // Add small delay between transactions to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('[WithdrawalProcessor] Batch processing completed');
    } catch (error) {
      console.error('[WithdrawalProcessor] Error processing withdrawals:', error);
    }
  }

  /**
   * Process a single withdrawal
   */
  private async processWithdrawal(withdrawal: any) {
    console.log(`[WithdrawalProcessor] Processing withdrawal ${withdrawal.id} for ${withdrawal.amount} SOL`);

    try {
      // Update status to PROCESSING
      await prisma.validatorWithdrawal.update({
        where: { id: withdrawal.id },
        data: { status: 'PROCESSING' },
      });

      // Verify validator has sufficient balance
      if (withdrawal.validator.pendingBalance < withdrawal.amount) {
        throw new Error(`Insufficient balance. Pending: ${withdrawal.validator.pendingBalance}, Requested: ${withdrawal.amount}`);
      }

      let txSignature: string;

      if (this.treasuryKeypair) {
        // Actually process the transaction on Solana
        txSignature = await this.sendSolanaTransaction(
          withdrawal.walletAddress,
          withdrawal.amount
        );
      } else {
        // Simulate transaction for testing/development
        txSignature = `SIMULATED_TX_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        console.log(`[WithdrawalProcessor] Simulated transaction: ${txSignature}`);
        // Add delay to simulate blockchain confirmation time
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Update withdrawal and validator balances
      await prisma.$transaction([
        // Mark withdrawal as completed
        prisma.validatorWithdrawal.update({
          where: { id: withdrawal.id },
          data: {
            status: 'COMPLETED',
            txSignature,
            processedAt: new Date(),
          },
        }),
        // Update validator balances
        prisma.validator.update({
          where: { id: withdrawal.validatorId },
          data: {
            pendingBalance: {
              decrement: withdrawal.amount,
            },
            totalWithdrawn: {
              increment: withdrawal.amount,
            },
          },
        }),
      ]);

      console.log(`[WithdrawalProcessor] ✓ Withdrawal ${withdrawal.id} completed. TX: ${txSignature}`);
    } catch (error: any) {
      console.error(`[WithdrawalProcessor] ✗ Failed to process withdrawal ${withdrawal.id}:`, error);

      // Mark withdrawal as failed
      await prisma.validatorWithdrawal.update({
        where: { id: withdrawal.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message || 'Unknown error',
          processedAt: new Date(),
        },
      });
    }
  }

  /**
   * Send actual Solana transaction
   */
  private async sendSolanaTransaction(
    destinationAddress: string,
    amountInSol: number
  ): Promise<string> {
    if (!this.treasuryKeypair) {
      throw new Error('Treasury keypair not initialized');
    }

    const lamports = amountInSol * LAMPORTS_PER_SOL;
    const destinationPubkey = new PublicKey(destinationAddress);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.treasuryKeypair.publicKey,
        toPubkey: destinationPubkey,
        lamports,
      })
    );

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.treasuryKeypair],
      {
        commitment: 'confirmed',
        maxRetries: MAX_RETRIES,
      }
    );

    return signature;
  }

  /**
   * Get processing statistics
   */
  async getStats() {
    const [pending, processing, completed, failed] = await Promise.all([
      prisma.validatorWithdrawal.count({ where: { status: 'PENDING' } }),
      prisma.validatorWithdrawal.count({ where: { status: 'PROCESSING' } }),
      prisma.validatorWithdrawal.count({ where: { status: 'COMPLETED' } }),
      prisma.validatorWithdrawal.count({ where: { status: 'FAILED' } }),
    ]);

    return {
      pending,
      processing,
      completed,
      failed,
      total: pending + processing + completed + failed,
    };
  }
}

// Export singleton instance
export const withdrawalProcessor = new WithdrawalProcessor();
