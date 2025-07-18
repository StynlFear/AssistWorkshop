import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent, AgentStatus, RiskLevel } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { updateAgent } from '../hooks/useAgents';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const agentEditFormSchema = z.object({
  agentId: z.string().min(1),
  codename: z.string().min(1),
  realName: z.string().optional(),
  status: z.enum(['ACTIVE', 'STANDBY', 'COMPROMISED', 'TRAINING', 'UNDERCOVER']),
  location: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  skills: z.string(),
  clearanceLevel: z.number().min(1).max(10),
  isActive: z.boolean(),
});

type AgentEditFormData = z.infer<typeof agentEditFormSchema>;

interface EditAgentFormProps {
  agent: Agent;
  onSuccess?: () => void;
}

export function EditAgentForm({ agent, onSuccess }: EditAgentFormProps) {
  const { toast } = useToast();
  const form = useForm<AgentEditFormData>({
    resolver: zodResolver(agentEditFormSchema),
    defaultValues: {
      agentId: agent.agentId,
      codename: agent.codename,
      realName: agent.realName || undefined,
      status: agent.status,
      location: agent.location || undefined,
      riskLevel: agent.riskLevel,
      skills: agent.skills,
      clearanceLevel: agent.clearanceLevel,
      isActive: agent.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      agentId: agent.agentId,
      codename: agent.codename,
      realName: agent.realName || undefined,
      status: agent.status,
      location: agent.location || undefined,
      riskLevel: agent.riskLevel,
      skills: agent.skills,
      clearanceLevel: agent.clearanceLevel,
      isActive: agent.isActive,
    });
  }, [agent, form]);

  async function onSubmit(data: AgentEditFormData) {
    try {
      await updateAgent(agent.id, {
        ...data,
        realName: data.realName || null,
        location: data.location || null,
      });
      toast({
        title: 'Success',
        description: 'Agent updated successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update agent',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent ID</FormLabel>
              <FormControl>
                <Input placeholder="G-001" {...field} />
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
              <FormLabel>Codename</FormLabel>
              <FormControl>
                <Input placeholder="SILENT SHADOW" {...field} />
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
              <FormLabel>Real Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                  {Object.values(AgentStatus).map((status) => (
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="New York, USA" {...field} />
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
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter agent skills (comma-separated)" 
                  {...field}
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
              <FormLabel>Clearance Level (1-10)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={10}
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value, 10))}
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

        <Button type="submit">Update Agent</Button>
      </form>
    </Form>
  );
}
