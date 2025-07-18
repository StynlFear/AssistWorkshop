"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { fetchAgents } from "@/lib/api"
import type { AgentWithRelations } from "@/lib/types"
import AgentSearch from "@/features/agents/agent_search"
import { AgentActiveStats, AgentCompromisedStats, AgentTrainingStats } from "@/features/agents/agent_stats"
import AgentTable from "@/features/agents/agent_table"
import AgentDetails from "@/features/agents/agent_details"
import AddAgentModal from "@/features/agents/add_agent_modal"

export default function AgentNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<AgentWithRelations | null>(null)
  const [agents, setAgents] = useState<AgentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true)
        const agentsData = await fetchAgents(searchTerm)
        setAgents(agentsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents')
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [searchTerm])

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAgentAdded = () => {
    // Reload agents after adding a new one
    const loadAgents = async () => {
      try {
        setLoading(true)
        const agentsData = await fetchAgents(searchTerm)
        setAgents(agentsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents')
      } finally {
        setLoading(false)
      }
    }
    loadAgents()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">AGENT NETWORK</h1>
          <p className="text-sm text-neutral-400">Manage and monitor field operatives</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Deploy Agent
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <AgentSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <AgentActiveStats />
        <AgentCompromisedStats />
        <AgentTrainingStats />
      </div>

      {/* Agent List */}
      <AgentTable 
        agents={filteredAgents}
        loading={loading}
        error={error}
        onAgentSelect={setSelectedAgent}
      />

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetails
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* Add Agent Modal */}
      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAgentAdded={handleAgentAdded}
        />
      )}
    </div>
  )
}
