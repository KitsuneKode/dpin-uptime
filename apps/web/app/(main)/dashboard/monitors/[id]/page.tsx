'use client'

import * as React from 'react'
import { useMonitor } from '@/hooks/api'
import { MonitorDetails, MonitorForm } from '@/components/monitors'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@dpin-uptime/ui/components/dialog'

export default function MonitorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const unwrappedParams = React.use(params)
  const [editOpen, setEditOpen] = React.useState(false)
  const { data: monitorResponse } = useMonitor(unwrappedParams.id)
  const monitor = monitorResponse?.data

  return (
    <div className="space-y-6">
      <MonitorDetails
        monitorId={unwrappedParams.id}
        onEdit={() => setEditOpen(true)}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Monitor</DialogTitle>
          </DialogHeader>
          {monitor && (
            <MonitorForm
              monitor={monitor}
              onSuccess={() => setEditOpen(false)}
              onCancel={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
