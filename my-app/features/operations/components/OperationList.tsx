import { Operation } from '@prisma/client';
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
import { EditOperationForm } from './EditOperationForm';
import { useState } from 'react';
import { format } from 'date-fns';

interface OperationListProps {
  operations: Operation[];
  onEdit?: () => void;
}

export function OperationList({ operations, onEdit }: OperationListProps) {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PLANNING: 'secondary',
      ACTIVE: 'default',
      COMPLETED: 'outline',
      COMPROMISED: 'destructive',
      SUSPENDED: 'destructive'
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
            <TableHead>Operation ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((operation) => (
            <TableRow key={operation.id}>
              <TableCell className="font-mono">{operation.operationId}</TableCell>
              <TableCell>{operation.name}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(operation.status)}>
                  {operation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getRiskVariant(operation.riskLevel)}>
                  {operation.riskLevel}
                </Badge>
              </TableCell>
              <TableCell>{operation.location || '-'}</TableCell>
              <TableCell>
                {operation.startDate ? format(operation.startDate, 'MMM d, yyyy') : '-'}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedOperation(operation)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  {selectedOperation && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Operation</DialogTitle>
                      </DialogHeader>
                      <EditOperationForm operation={selectedOperation} onSuccess={onEdit} />
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
