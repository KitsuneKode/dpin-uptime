'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@dpin-uptime/ui/components/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@dpin-uptime/ui/components/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Ban, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type ValidatorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  status: ValidatorStatus;
  approvedAt: string | null;
  approvedBy: string | null;
  totalEarned: number;
  totalWithdrawn: number;
  pendingBalance: number;
  totalValidations: number;
  totalEarnings: number;
  totalWithdrawals: number;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Pending',
  },
  APPROVED: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    label: 'Approved',
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Rejected',
  },
  SUSPENDED: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    label: 'Suspended',
  },
};

export default function AdminValidatorsPage() {
  const [statusFilter, setStatusFilter] = React.useState<'all' | ValidatorStatus>('all');
  const queryClient = useQueryClient();

  const { data: validatorsResponse, isLoading } = useQuery({
    queryKey: ['admin', 'validators', statusFilter],
    queryFn: async () => {
      return await api.getValidators(statusFilter !== 'all' ? statusFilter : undefined);
    },
    staleTime: 30 * 1000,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.approveValidator(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'validators'] });
      toast.success('Validator approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve validator');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.rejectValidator(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'validators'] });
      toast.success('Validator rejected');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject validator');
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.suspendValidator(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'validators'] });
      toast.success('Validator suspended');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to suspend validator');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteValidator(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'validators'] });
      toast.success('Validator deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete validator');
    },
  });

  const validators = validatorsResponse?.data || [];

  const stats = {
    total: validators.length,
    pending: validators.filter(v => v.status === 'PENDING').length,
    approved: validators.filter(v => v.status === 'APPROVED').length,
    rejected: validators.filter(v => v.status === 'REJECTED').length,
    suspended: validators.filter(v => v.status === 'SUSPENDED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Validator Management</h1>
        <p className="text-muted-foreground mt-2">
          Approve, reject, or manage validators in the network
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Validators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Validators Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Validators</CardTitle>
            <div className="flex items-center gap-4">
              <Select
                value={statusFilter}
                onValueChange={(v: typeof statusFilter) => setStatusFilter(v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', 'validators'] })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : validators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No validators found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Public Key</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Validations</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validators.map((validator) => (
                    <TableRow key={validator.id}>
                      <TableCell className="font-mono text-xs">
                        {validator.publicKey.substring(0, 8)}...{validator.publicKey.substring(validator.publicKey.length - 8)}
                      </TableCell>
                      <TableCell>{validator.location}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[validator.status as ValidatorStatus].color}>
                          {statusConfig[validator.status as ValidatorStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{validator.totalValidations.toLocaleString()}</TableCell>
                      <TableCell>{validator.totalEarned.toFixed(4)} SOL</TableCell>
                      <TableCell>{validator.pendingBalance.toFixed(4)} SOL</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(validator.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {validator.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => approveMutation.mutate(validator.id)}
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => rejectMutation.mutate(validator.id)}
                                disabled={rejectMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {validator.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 hover:text-gray-700"
                              onClick={() => suspendMutation.mutate(validator.id)}
                              disabled={suspendMutation.isPending}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          {(validator.status === 'REJECTED' || validator.status === 'SUSPENDED') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => approveMutation.mutate(validator.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this validator?')) {
                                deleteMutation.mutate(validator.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
