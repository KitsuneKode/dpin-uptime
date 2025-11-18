'use client'

import * as React from 'react'
import type { StatusPage } from '@/lib/types'
import { Badge } from '@dpin-uptime/ui/components/badge'
import { Button } from '@dpin-uptime/ui/components/button'
import { Skeleton } from '@dpin-uptime/ui/components/skeleton'
import { Globe, Eye, Pencil, Trash2, Plus } from 'lucide-react'
import { useStatusPages, useDeleteStatusPage } from '@/hooks/api'
import { StatusPageForm, StatusPagePreview } from '@/components/status-pages'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@dpin-uptime/ui/components/dialog'

export default function StatusPagesPage() {
  const { data: pagesResponse, isLoading } = useStatusPages()
  const deleteStatusPage = useDeleteStatusPage()

  const pages = pagesResponse?.data || []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<StatusPage | null>(null)
  const [previewing, setPreviewing] = React.useState<StatusPage | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Delete this status page?')) {
      try {
        await deleteStatusPage.mutateAsync(id)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Status Pages</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage public-facing status pages for your services
            {pages.length > 0 &&
              ` • ${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="lg"
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Status Page
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Globe className="text-primary h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No status pages yet</h3>
            <p className="text-muted-foreground mx-auto mb-6 max-w-md">
              Create a public status page to keep your users informed about
              service availability and incidents.
            </p>
            <Button onClick={() => setCreateOpen(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Status Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="hover:border-primary/50 group flex flex-col transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2 transition-transform group-hover:scale-110">
                    <Globe className="text-primary h-5 w-5" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">
                    {page.companyName}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Subdomain:</span>
                    <Badge variant="secondary" className="font-mono">
                      {page.subdomain}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Theme:</span>
                    <Badge variant="outline" className="capitalize">
                      {page.theme}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Monitors:</span>
                    <Badge variant="outline">{page.monitors.length}</Badge>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewing(page)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(page)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Status Page</DialogTitle>
          </DialogHeader>
          <StatusPageForm
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Status Page</DialogTitle>
          </DialogHeader>
          {editing && (
            <StatusPageForm
              statusPage={editing}
              onSuccess={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!previewing}
        onOpenChange={(open) => !open && setPreviewing(null)}
      >
        <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle>Preview</DialogTitle>
              {previewing && (
                <Badge variant="outline" className="font-mono text-xs">
                  {previewing.subdomain}.status.example.com
                </Badge>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {previewing && <StatusPagePreview statusPage={previewing} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
