'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Input } from '@dpin-uptime/ui/components/input';
import { Label } from '@dpin-uptime/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@dpin-uptime/ui/components/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@dpin-uptime/ui/components/form';
import { useCreateStatusPage, useUpdateStatusPage, useMonitors } from '@/hooks/api';
import { Loader2, Upload, Monitor } from 'lucide-react';
import type { StatusPage } from '@/lib/types';

const statusPageSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Name must be less than 100 characters'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(50, 'Subdomain must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  theme: z.enum(['light', 'dark']),
  monitors: z.array(z.string()).min(1, 'Please select at least one monitor'),
});

type StatusPageFormData = z.infer<typeof statusPageSchema>;

interface StatusPageFormProps {
  statusPage?: StatusPage;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StatusPageForm({ statusPage, onSuccess, onCancel }: StatusPageFormProps) {
  const isEditing = !!statusPage;
  const createStatusPage = useCreateStatusPage();
  const updateStatusPage = useUpdateStatusPage();
  const { data: monitorsResponse } = useMonitors({ limit: 100 });

  const monitors = monitorsResponse?.data || [];

  const form = useForm<StatusPageFormData>({
    resolver: zodResolver(statusPageSchema),
    defaultValues: {
      companyName: statusPage?.companyName || '',
      subdomain: statusPage?.subdomain || '',
      logoUrl: statusPage?.logoUrl || '',
      theme: statusPage?.theme || 'light',
      monitors: statusPage?.monitors || [],
    },
  });

  const onSubmit = async (data: StatusPageFormData) => {
    try {
      if (isEditing && statusPage) {
        await updateStatusPage.mutateAsync({
          id: statusPage.id,
          ...data,
        });
      } else {
        await createStatusPage.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save status page:', error);
    }
  };

  const isLoading = createStatusPage.isPending || updateStatusPage.isPending;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Status Page' : 'Create Status Page'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Acme Inc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          placeholder="acme" 
                          {...field} 
                          className="rounded-r-none"
                        />
                        <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                          .status.example.com
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your status page will be available at {field.value || 'subdomain'}.status.example.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Personalization */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personalization</h3>
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="https://example.com/logo.png" 
                          {...field} 
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload or provide a URL to your company logo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Monitor Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monitors</h3>
              
              <FormField
                control={form.control}
                name="monitors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Monitors to Display</FormLabel>
                    <FormDescription>
                      Choose which monitors will be visible on your public status page
                    </FormDescription>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                      {monitors.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          <Monitor className="h-8 w-8 mx-auto mb-2" />
                          <p>No monitors available</p>
                          <p className="text-xs">Create some monitors first</p>
                        </div>
                      ) : (
                        monitors.map((monitor) => (
                          <div key={monitor.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={monitor.id}
                              checked={field.value.includes(monitor.id)}
                              onChange={(e) => {
                                const updatedMonitors = e.target.checked
                                  ? [...field.value, monitor.id]
                                  : field.value.filter(id => id !== monitor.id);
                                field.onChange(updatedMonitors);
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={monitor.id} className="text-sm flex-1">
                              <div className="flex items-center justify-between">
                                <span>{monitor.name}</span>
                                <span className="text-xs text-muted-foreground">{monitor.url}</span>
                              </div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading || monitors.length === 0}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Status Page' : 'Create Status Page'}
              </Button>
              
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
