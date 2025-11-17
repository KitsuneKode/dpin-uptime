'use client'

import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/utils/config'
import { formatDistanceToNow } from 'date-fns'
import { useWallet } from '@solana/wallet-adapter-react'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Input } from '@dpin-uptime/ui/components/input'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TrendingUp, ArrowDownToLine, History, DollarSign } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@dpin-uptime/ui/components/card'

export default function ValidatorDashboard() {
  const { publicKey, connected } = useWallet()
  const queryClient = useQueryClient()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawWallet, setWithdrawWallet] = useState('')

  // Auto-fill withdraw wallet with connected wallet
  useEffect(() => {
    if (publicKey && !withdrawWallet) {
      setWithdrawWallet(publicKey.toBase58())
    }
  }, [publicKey, withdrawWallet])

  // Fetch validator stats
  const { data: validatorData, isLoading } = useQuery({
    queryKey: ['validator', publicKey?.toBase58()],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/validator/${publicKey?.toBase58()}`,
      )
      return response.json()
    },
    enabled: !!publicKey,
    refetchInterval: 10000, // Refetch every 10 seconds
  })

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; walletAddress: string }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/validator/${publicKey?.toBase58()}/withdraw`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      )
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validator'] })
      setWithdrawAmount('')
      alert('Withdrawal request submitted successfully!')
    },
    onError: (error: any) => {
      alert(`Withdrawal failed: ${error.message}`)
    },
  })

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    if (!withdrawWallet) {
      alert('Please enter a wallet address')
      return
    }
    withdrawMutation.mutate({ amount, walletAddress: withdrawWallet })
  }

  const validator = validatorData?.data

  if (!connected) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Validator Dashboard</CardTitle>
            <CardDescription>
              Connect your Solana wallet to view your validator earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletMultiButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!validator) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validator Not Found</CardTitle>
            <CardDescription>
              No validator found for wallet: {publicKey?.toBase58().slice(0, 8)}
              ...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center text-sm">
            Start running a validator node to earn rewards!
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Validator Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {publicKey?.toBase58().slice(0, 8)}...
              {publicKey?.toBase58().slice(-8)}
            </p>
          </div>
          <WalletMultiButton />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Balance
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validator.pendingBalance.toFixed(4)} SOL
              </div>
              <p className="text-muted-foreground text-xs">
                Available to withdraw
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validator.totalEarned.toFixed(4)} SOL
              </div>
              <p className="text-muted-foreground text-xs">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Withdrawn
              </CardTitle>
              <ArrowDownToLine className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validator.totalWithdrawn.toFixed(4)} SOL
              </div>
              <p className="text-muted-foreground text-xs">
                All-time withdrawals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validations</CardTitle>
              <History className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validator.totalValidations.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs">
                Total checks performed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw Section */}
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Earnings</CardTitle>
            <CardDescription>
              Transfer your earned SOL to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (SOL)</label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="0.0000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={validator.pendingBalance}
                />
                <p className="text-muted-foreground text-xs">
                  Available: {validator.pendingBalance.toFixed(4)} SOL
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input
                  placeholder="Solana wallet address"
                  value={withdrawWallet}
                  onChange={(e) => setWithdrawWallet(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() =>
                setWithdrawAmount(validator.pendingBalance.toString())
              }
              disabled={
                withdrawMutation.isPending || parseFloat(withdrawAmount) <= 0
              }
              className="mr-6"
              variant="secondary"
            >
              Max
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                withdrawMutation.isPending || parseFloat(withdrawAmount) <= 0
              }
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Latest validation rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validator.recentEarnings.slice(0, 10).map((earning: any) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      +{earning.amount.toFixed(4)} SOL
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {earning.description || 'Validation reward'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(earning.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your past withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {validator.recentWithdrawals.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                No withdrawals yet
              </p>
            ) : (
              <div className="space-y-3">
                {validator.recentWithdrawals.map((withdrawal: any) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {withdrawal.amount.toFixed(4)} SOL
                      </p>
                      <p className="text-muted-foreground text-xs">
                        To: {withdrawal.walletAddress.slice(0, 8)}...
                        {withdrawal.walletAddress.slice(-8)}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <Badge
                        variant={
                          withdrawal.status === 'COMPLETED'
                            ? 'default'
                            : withdrawal.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {withdrawal.status}
                      </Badge>
                      <p className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(withdrawal.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
