'use client';

import * as React from 'react';
import { MonitorsList, MonitorForm } from '@/components/monitors';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@dpin-uptime/ui/components/dialog';
import type { Monitor } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function MonitorsPage() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingMonitor, setEditingMonitor] = React.useState<Monitor | null>(null);

  return (
    <div className="space-y-6">
      <MonitorsList
        onCreateMonitor={() => setCreateOpen(true)}
        onEditMonitor={(m) => setEditingMonitor(m)}
        onViewDetails={(m) => router.push(`/dashboard/monitors/${m.id}`)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Monitor</DialogTitle>
          </DialogHeader>
          <MonitorForm
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingMonitor} onOpenChange={(open) => !open && setEditingMonitor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Monitor</DialogTitle>
          </DialogHeader>
          {editingMonitor && (
            <MonitorForm
              monitor={editingMonitor}
              onSuccess={() => setEditingMonitor(null)}
              onCancel={() => setEditingMonitor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
