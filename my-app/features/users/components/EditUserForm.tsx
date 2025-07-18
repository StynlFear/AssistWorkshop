import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Role, User } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '../hooks/useUsers';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const userEditFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  role: z.enum(['ADMIN', 'ANALYST', 'OPERATOR', 'VIEWER']),
  isActive: z.boolean(),
});

type UserEditFormData = z.infer<typeof userEditFormSchema>;

interface EditUserFormProps {
  user: User;
  onSuccess?: () => void;
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const { toast } = useToast();
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    form.reset({
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    });
  }, [user, form]);

  async function onSubmit(data: UserEditFormData) {
    try {
      await updateUser(user.id, data);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
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

        <Button type="submit">Update User</Button>
      </form>
    </Form>
  );
}
