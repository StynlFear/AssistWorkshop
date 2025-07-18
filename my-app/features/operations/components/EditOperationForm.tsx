import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Operation, OperationStatus, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { updateOperation } from '../hooks/useOperations';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const operationEditFormSchema = z.object({
  operationId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'COMPROMISED', 'SUSPENDED']),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  briefing: z.string().optional(),
  objectives: z.string(),
  isActive: z.boolean(),
});

type OperationEditFormData = z.infer<typeof operationEditFormSchema>;

interface EditOperationFormProps {
  operation: Operation;
  onSuccess?: () => void;
}

export function EditOperationForm({ operation, onSuccess }: EditOperationFormProps) {
  const { toast } = useToast();
  const form = useForm<OperationEditFormData>({
    resolver: zodResolver(operationEditFormSchema),
    defaultValues: {
      operationId: operation.operationId,
      name: operation.name,
      description: operation.description,
      status: operation.status,
      riskLevel: operation.riskLevel,
      location: operation.location || undefined,
      startDate: operation.startDate || undefined,
      endDate: operation.endDate || undefined,
      plannedEndDate: operation.plannedEndDate || undefined,
      briefing: operation.briefing || undefined,
      objectives: operation.objectives,
      isActive: operation.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      operationId: operation.operationId,
      name: operation.name,
      description: operation.description,
      status: operation.status,
      riskLevel: operation.riskLevel,
      location: operation.location || undefined,
      startDate: operation.startDate || undefined,
      endDate: operation.endDate || undefined,
      plannedEndDate: operation.plannedEndDate || undefined,
      briefing: operation.briefing || undefined,
      objectives: operation.objectives,
      isActive: operation.isActive,
    });
  }, [operation, form]);

  async function onSubmit(data: OperationEditFormData) {
    try {
      await updateOperation(operation.id, {
        ...data,
        location: data.location || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        plannedEndDate: data.plannedEndDate || null,
        briefing: data.briefing || null,
      });
      toast({
        title: 'Success',
        description: 'Operation updated successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update operation',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="operationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation ID</FormLabel>
              <FormControl>
                <Input placeholder="OP-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation Name</FormLabel>
              <FormControl>
                <Input placeholder="Operation Shadow Storm" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation description" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(OperationStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          name="riskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Operation location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plannedEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Planned End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="briefing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Briefing (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation briefing" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectives</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation objectives (comma-separated)" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
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

        <Button type="submit">Update Operation</Button>
      </form>
    </Form>
  );
}
