import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassificationLevel, IntelligenceReport, IntelligenceType, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { updateIntelligenceReport } from '../hooks/useIntelligence';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const reportFormSchema = z.object({
  reportId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  classification: z.enum(['CONFIDENTIAL', 'SECRET', 'TOP_SECRET']),
  type: z.enum(['HUMINT', 'SIGINT', 'DIPLOMATIC', 'OSINT']),
  location: z.string().optional(),
  tags: z.string(),
  sourceId: z.string().optional(),
  operationId: z.string().optional(),
  threatLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  isActive: z.boolean(),
});

type ReportFormData = z.infer<typeof reportFormSchema>;

interface EditIntelligenceFormProps {
  report: IntelligenceReport;
  onSuccess?: () => void;
}

export function EditIntelligenceForm({ report, onSuccess }: EditIntelligenceFormProps) {
  const { toast } = useToast();
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportId: report.reportId,
      title: report.title,
      description: report.description || '',
      content: report.content,
      classification: report.classification,
      type: report.type,
      location: report.location || '',
      tags: Array.isArray(report.tags) ? report.tags.join(', ') : report.tags || '',
      sourceId: report.sourceId || '',
      operationId: report.operationId || '',
      threatLevel: report.threatLevel,
      isActive: report.isActive,
    },
  });

  async function onSubmit(data: ReportFormData) {
    try {
      await updateIntelligenceReport(report.id, {
        ...data,
        description: data.description || null,
        location: data.location || null,
        sourceId: data.sourceId || null,
        operationId: data.operationId || null,
      });
      toast({
        title: 'Success',
        description: 'Intelligence report updated successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update intelligence report',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reportId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report ID</FormLabel>
              <FormControl>
                <Input placeholder="INT-2025-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Report title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter report description" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter report content" 
                  className="min-h-[200px]"
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
            name="classification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classification Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ClassificationLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intelligence Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(IntelligenceType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Source reference" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operation ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Related operation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="threatLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Threat Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select threat level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(RiskLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
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
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Update Report</Button>
      </form>
    </Form>
  );
}
