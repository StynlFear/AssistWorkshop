import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassificationLevel, IntelligenceType, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { createIntelligenceReport } from '../hooks/useIntelligence';
import { Textarea } from '@/components/ui/textarea';

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
});

type ReportFormData = z.infer<typeof reportFormSchema>;

export function AddIntelligenceForm() {
  const { toast } = useToast();
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      classification: 'CONFIDENTIAL',
      type: 'HUMINT',
      threatLevel: 'LOW',
    },
  });

  async function onSubmit(data: ReportFormData) {
    try {
      await createIntelligenceReport({
        ...data,
        description: data.description || null,
        location: data.location || null,
        sourceId: data.sourceId || null,
        operationId: data.operationId || null,
        isActive: true,
      });
      toast({
        title: 'Success',
        description: 'Intelligence report created successfully',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create intelligence report',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="reportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">REPORT ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="INT-2025-001" 
                    {...field} 
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                  />
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">TITLE</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Report title" 
                    {...field} 
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                  />
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">DESCRIPTION (OPTIONAL)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter report description" 
                    {...field}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">CONTENT</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter report content" 
                    className="min-h-[200px] bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
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
                  <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">CLASSIFICATION LEVEL</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-neutral-800 border-neutral-600">
                      {Object.values(ClassificationLevel).map((level) => (
                        <SelectItem key={level} value={level} className="text-white hover:bg-neutral-700">
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
                  <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">INTELLIGENCE TYPE</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-neutral-800 border-neutral-600">
                      {Object.values(IntelligenceType).map((type) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-neutral-700">
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">LOCATION (OPTIONAL)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Location" 
                    {...field} 
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">TAGS</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter tags (comma-separated)" 
                    {...field} 
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
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
                  <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">SOURCE ID (OPTIONAL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Source reference" 
                      {...field} 
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                    />
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
                  <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">OPERATION ID (OPTIONAL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Related operation" 
                      {...field} 
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                    />
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">THREAT LEVEL</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                      <SelectValue placeholder="Select threat level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    {Object.values(RiskLevel).map((level) => (
                      <SelectItem key={level} value={level} className="text-white hover:bg-neutral-700">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-mono tracking-wider">
            CREATE REPORT
          </Button>
        </form>
      </Form>
    </div>
  );
}
