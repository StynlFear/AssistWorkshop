import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AgentStatus, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { createAgent } from '../hooks/useAgents';
import { Textarea } from '@/components/ui/textarea';

const agentFormSchema = z.object({
  agentId: z.string().min(1),
  codename: z.string().min(1),
  realName: z.string().optional(),
  status: z.enum(['ACTIVE', 'STANDBY', 'COMPROMISED', 'TRAINING', 'UNDERCOVER']),
  location: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  skills: z.string(),
  clearanceLevel: z.number().min(1).max(10),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

export function AddAgentForm() {
  const { toast } = useToast();
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      status: 'STANDBY',
      riskLevel: 'LOW',
      clearanceLevel: 1,
    },
  });

  async function onSubmit(data: AgentFormData) {
    try {
      await createAgent({
        ...data,
        realName: data.realName || null,
        location: data.location || null,
        missionCount: 0,
        isActive: true,
      });
      toast({
        title: 'Success',
        description: 'Agent created successfully',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create agent',
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
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">AGENT ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="G-001" 
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
            name="codename"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">CODENAME</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="SILENT SHADOW" 
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
            name="realName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">REAL NAME (OPTIONAL)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
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
                  {Object.values(AgentStatus).map((status) => (
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">LOCATION (OPTIONAL)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="New York, USA" 
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
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">SKILLS</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter agent skills (comma-separated)" 
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
          name="clearanceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-neutral-300 tracking-wider">CLEARANCE LEVEL (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={10}
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value, 10))}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-mono tracking-wider">
          DEPLOY AGENT
        </Button>
      </form>
    </Form>
    </div>
  );
}
