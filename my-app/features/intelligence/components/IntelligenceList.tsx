import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditIntelligenceForm } from './EditIntelligenceForm';
import { useIntelligence } from '../hooks/useIntelligence';
import { IntelligenceReport } from '@prisma/client';

export function IntelligenceList() {
  const { reports, error, isLoading, mutate } = useIntelligence();
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (error) return <div>Failed to load intelligence reports</div>;
  if (isLoading) return <div>Loading...</div>;

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'CONFIDENTIAL':
        return 'bg-blue-100 text-blue-800';
      case 'SECRET':
        return 'bg-red-100 text-red-800';
      case 'TOP_SECRET':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report: IntelligenceReport) => (
        <Card key={report.id} className={report.isActive ? '' : 'opacity-60'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {report.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getClassificationColor(report.classification)}>
                {report.classification}
              </Badge>
              <Badge variant="outline" className={getThreatLevelColor(report.threatLevel)}>
                {report.threatLevel}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedReport(report);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="text-sm">
                <span className="font-medium">Report ID:</span> {report.reportId}
              </div>
              {report.description && (
                <div className="text-sm text-muted-foreground">
                  {report.description}
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">Type:</span> {report.type}
              </div>
              {report.location && (
                <div className="text-sm">
                  <span className="font-medium">Location:</span> {report.location}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {Array.isArray(report.tags) ? (
                  report.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  typeof report.tags === 'string' && report.tags.split(',').map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Intelligence Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <EditIntelligenceForm 
              report={selectedReport}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                mutate();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
