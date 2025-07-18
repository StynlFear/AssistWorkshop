"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { OperationWithRelations } from "@/lib/types"

interface OpsOperationDetailsProps {
  operation: OperationWithRelations
  onClose: () => void
}

export default function OpsOperationDetails({ operation, onClose }: OpsOperationDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-white/20 text-white"
      case "planning":
        return "bg-orange-500/20 text-orange-500"
      case "completed":
        return "bg-white/20 text-white"
      case "compromised":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-500"
      case "high":
        return "bg-orange-500/20 text-orange-500"
      case "medium":
        return "bg-neutral-500/20 text-neutral-300"
      case "low":
        return "bg-white/20 text-white"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white tracking-wider">{operation.name}</CardTitle>
            <p className="text-sm text-neutral-400 font-mono">{operation.id}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">OPERATION STATUS</h3>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(operation.status)}>
                    {operation.status.toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityColor(operation.priority)}>
                    {operation.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">MISSION DETAILS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Location:</span>
                    <span className="text-white">{operation.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Agents:</span>
                    <span className="text-white font-mono">{operation.assignments?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Start Date:</span>
                    <span className="text-white font-mono">{formatDate(operation.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Est. Completion:</span>
                    <span className="text-white font-mono">{formatDate(operation.estimatedCompletion)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PROGRESS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Completion</span>
                    <span className="text-white font-mono">{operation.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${operation.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">OBJECTIVES</h3>
                <div className="space-y-2">
                  {operation.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${objective.isCompleted ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="text-neutral-300">{objective.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
            <p className="text-sm text-neutral-300">{operation.description}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Update Status</Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              View Reports
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              Assign Agents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
