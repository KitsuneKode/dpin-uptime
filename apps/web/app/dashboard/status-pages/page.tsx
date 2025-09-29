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
        <h1 className="text-xl font-semibold">Status Pages</h1>
        <Button onClick={() => setCreateOpen(true)}>
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
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No status pages yet. Create your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  {page.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="text-sm text-muted-foreground">
                  Subdomain: <Badge variant="secondary">{page.subdomain}</Badge>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewing(page)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(page)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(page.id)}>
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
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="p-6">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          {previewing && <StatusPagePreview statusPage={previewing} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
