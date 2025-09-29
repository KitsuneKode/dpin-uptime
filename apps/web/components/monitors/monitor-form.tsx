'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@dpin-uptime/ui/components/card';
import { Button } from '@dpin-uptime/ui/components/button';
import { Input } from '@dpin-uptime/ui/components/input';
import { Label } from '@dpin-uptime/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@dpin-uptime/ui/components/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@dpin-uptime/ui/components/form';
import { useCreateMonitor, useUpdateMonitor } from '@/hooks/api';
import { Loader2 } from 'lucide-react';
import type { Monitor } from '@/lib/types';

const monitorSchema = z.object({
  name: z.string().min(1, 'Monitor name is required').max(100, 'Name must be less than 100 characters'),
  url: z.string().url('Please enter a valid URL'),
  interval: z.string().min(1, 'Check interval is required'),
  timeout: z.number().min(1, 'Timeout must be at least 1 second').max(60, 'Timeout must be less than 60 seconds').optional(),
  expectedStatusCodes: z.array(z.number()).optional(),
  locations: z.array(z.string()).optional(),
});

type MonitorFormData = z.infer<typeof monitorSchema>;

interface MonitorFormProps {
  monitor?: Monitor;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const intervalOptions = [
  { value: '30s', label: '30 seconds' },
  { value: '1m', label: '1 minute' },
  { value: '3m', label: '3 minutes' },
  { value: '5m', label: '5 minutes' },
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
];

const locationOptions = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'Europe West' },
  { value: 'asia-southeast', label: 'Asia Southeast' },
];

export function MonitorForm({ monitor, onSuccess, onCancel }: MonitorFormProps) {
  const isEditing = !!monitor;
  const createMonitor = useCreateMonitor();
  const updateMonitor = useUpdateMonitor();

  const form = useForm<MonitorFormData>({
    resolver: zodResolver(monitorSchema),
    defaultValues: {
      name: monitor?.name || '',
      url: monitor?.url || '',
      interval: monitor?.interval || '5m',
      timeout: 30,
      expectedStatusCodes: [200, 201, 202, 203, 204],
      locations: ['us-east'],
    },
  });

  const onSubmit = async (data: MonitorFormData) => {
    try {
      if (isEditing && monitor) {
        await updateMonitor.mutateAsync({
          id: monitor.id,
          ...data,
        });
      } else {
        await createMonitor.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save monitor:', error);
    }
  };

  const isLoading = createMonitor.isPending || updateMonitor.isPending;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Monitor' : 'Create New Monitor'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monitor Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My Website" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL to Monitor</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Interval</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {intervalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (seconds)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="60" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Expected Status Codes</Label>
              <div className="mt-2 text-sm text-muted-foreground">
                Default: 200, 201, 202, 203, 204
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Monitoring Locations</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {locationOptions.map((location) => (
                  <div key={location.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={location.value}
                      defaultChecked={location.value === 'us-east'}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={location.value} className="text-sm">
                      {location.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update Monitor' : 'Create Monitor'}
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
