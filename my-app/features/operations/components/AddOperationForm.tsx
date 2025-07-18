import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OperationStatus, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { createOperation } from '../hooks/useOperations';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const operationFormSchema = z.object({
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
});

type OperationFormData = z.infer<typeof operationFormSchema>;

export function AddOperationForm() {
  const { toast } = useToast();
  const form = useForm<OperationFormData>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: {
      status: 'PLANNING',
      riskLevel: 'LOW',
    },
  });

  async function onSubmit(data: OperationFormData) {
    try {
      await createOperation({
        ...data,
        location: data.location || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        plannedEndDate: data.plannedEndDate || null,
        briefing: data.briefing || null,
        isActive: true,
      });
      toast({
        title: 'Success',
        description: 'Operation created successfully',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create operation',
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
            name="operationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">OPERATION ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="OP-001" 
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">OPERATION NAME</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Operation Shadow Storm" 
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
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">DESCRIPTION</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation description" 
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">STATUS</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  {Object.values(OperationStatus).map((status) => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-neutral-700">
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
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">RISK LEVEL</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue placeholder="Select risk level" />
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

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">LOCATION (OPTIONAL)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Operation location" 
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
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">START DATE (OPTIONAL)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700",
                          !field.value && "text-neutral-400"
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
                  <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-600" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                      className="bg-neutral-800 text-white"
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
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">PLANNED END DATE (OPTIONAL)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700",
                          !field.value && "text-neutral-400"
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
                  <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-600" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                      className="bg-neutral-800 text-white"
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
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">BRIEFING (OPTIONAL)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation briefing" 
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
          name="objectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">OBJECTIVES</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter operation objectives (comma-separated)" 
                  {...field}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-mono tracking-wider">
          CREATE OPERATION
        </Button>
      </form>
    </Form>
    </div>
  );
}
