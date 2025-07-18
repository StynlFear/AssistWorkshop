"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MapPin, Clock } from "lucide-react"
import type { AgentWithRelations } from "@/lib/types"

interface AgentTableProps {
  agents: AgentWithRelations[]
  loading: boolean
  error: string | null
  onAgentSelect: (agent: AgentWithRelations) => void
}

export default function AgentTable({ agents, loading, error, onAgentSelect }: AgentTableProps) {
  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(lastSeen).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">AGENT ROSTER</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-400">Loading agents...</div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400">Error: {error}</div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">AGENT ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">CODENAME</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUS</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">LOCATION</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">LAST SEEN</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">MISSIONS</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">RISK</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr
                  key={agent.id}
                  className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                    index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-850"
                  }`}
                  onClick={() => onAgentSelect(agent)}
                >
                  <td className="py-3 px-4 text-sm text-white font-mono">{agent.agentId}</td>
                  <td className="py-3 px-4 text-sm text-white">{agent.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          agent.status === "active"
                            ? "bg-white"
                            : agent.status === "standby"
                              ? "bg-neutral-500"
                              : agent.status === "training"
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-xs text-neutral-300 uppercase tracking-wider">{agent.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm text-neutral-300">{agent.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm text-neutral-300 font-mono">{formatLastSeen(agent.lastSeen)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-white font-mono">{agent.missions}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                        agent.riskLevel === "critical"
                          ? "bg-red-500/20 text-red-500"
                          : agent.riskLevel === "high"
                            ? "bg-orange-500/20 text-orange-500"
                            : agent.riskLevel === "medium"
                              ? "bg-neutral-500/20 text-neutral-300"
                              : "bg-white/20 text-white"
                      }`}
                    >
                      {agent.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </CardContent>
    </Card>
  )
}
