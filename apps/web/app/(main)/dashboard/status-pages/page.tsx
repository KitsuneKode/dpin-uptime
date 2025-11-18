'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Skeleton } from '@dpin-uptime/ui/components/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@dpin-uptime/ui/components/dialog';
import { Badge } from '@dpin-uptime/ui/components/badge';
import { useStatusPages, useDeleteStatusPage } from '@/hooks/api';
import { StatusPageForm, StatusPagePreview } from '@/components/status-pages';
import type { StatusPage } from '@/lib/types';
import { Globe, Eye, Pencil, Trash2, Plus } from 'lucide-react';

export default function StatusPagesPage() {
  const { data: pagesResponse, isLoading } = useStatusPages();
  const deleteStatusPage = useDeleteStatusPage();

  const pages = pagesResponse?.data || [];

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<StatusPage | null>(null);
  const [previewing, setPreviewing] = React.useState<StatusPage | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this status page?')) {
      try {
        await deleteStatusPage.mutateAsync(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Status Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage public-facing status pages for your services
            {pages.length > 0 && ` • ${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="lg" className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
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
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No status pages yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a public status page to keep your users informed about service availability and incidents.
            </p>
            <Button onClick={() => setCreateOpen(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Status Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="flex flex-col transition-all duration-200 hover:shadow-lg hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg transition-transform group-hover:scale-110">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <span className="transition-colors group-hover:text-primary">{page.companyName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Subdomain:</span>
                    <Badge variant="secondary" className="font-mono">{page.subdomain}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Theme:</span>
                    <Badge variant="outline" className="capitalize">{page.theme}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Monitors:</span>
                    <Badge variant="outline">{page.monitors.length}</Badge>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewing(page)} className="hover:bg-primary/10 hover:text-primary">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(page)} className="hover:bg-primary hover:text-primary-foreground">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
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
          <StatusPageForm onSuccess={() => setCreateOpen(false)} onCancel={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Status Page</DialogTitle>
          </DialogHeader>
          {editing && (
            <StatusPageForm statusPage={editing} onSuccess={() => setEditing(null)} onCancel={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewing} onOpenChange={(open) => !open && setPreviewing(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Preview</DialogTitle>
              {previewing && (
                <Badge variant="outline" className="font-mono text-xs">
                  {previewing.subdomain}.status.example.com
                </Badge>
              )}
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            {previewing && <StatusPagePreview statusPage={previewing} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
