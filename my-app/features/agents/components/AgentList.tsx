import { Agent } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EditAgentForm } from './EditAgentForm';
import { useState } from 'react';

interface AgentListProps {
  agents: Agent[];
  onEdit?: () => void;
}

export function AgentList({ agents, onEdit }: AgentListProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: 'default',
      STANDBY: 'secondary',
      COMPROMISED: 'destructive',
      TRAINING: 'outline',
      UNDERCOVER: 'secondary'
    };
    return variants[status] || 'default';
  };

  const getRiskVariant = (level: string): "default" | "secondary" | "destructive" => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      LOW: 'default',
      MEDIUM: 'secondary',
      HIGH: 'destructive',
      CRITICAL: 'destructive'
    };
    return variants[level] || 'default';
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent ID</TableHead>
            <TableHead>Codename</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Missions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>{agent.agentId}</TableCell>
              <TableCell>{agent.codename}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(agent.status)}>
                  {agent.status}
                </Badge>
              </TableCell>
              <TableCell>{agent.location || '-'}</TableCell>
              <TableCell>
                <Badge variant={getRiskVariant(agent.riskLevel)}>
                  {agent.riskLevel}
                </Badge>
              </TableCell>
              <TableCell>{agent.missionCount}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  {selectedAgent && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Agent</DialogTitle>
                      </DialogHeader>
                      <EditAgentForm agent={selectedAgent} onSuccess={onEdit} />
                    </DialogContent>
                  )}
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
