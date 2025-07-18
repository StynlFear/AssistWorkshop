"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fetchOperations } from "@/lib/api"
import type { OperationWithRelations } from "@/lib/types"
import OpsStats from "@/features/operations/ops_stats"
import OpsOperationThumbnail from "@/features/operations/ops_operation-thumbnail"
import OpsOperationDetails from "@/features/operations/ops_operation-details"

export default function OperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState<OperationWithRelations | null>(null)
  const [operations, setOperations] = useState<OperationWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOperations = async () => {
      try {
        setLoading(true)
        const operationsData = await fetchOperations()
        setOperations(operationsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load operations')
      } finally {
        setLoading(false)
      }
    }

    loadOperations()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/*AI_TIP Header Section*/}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">OPERATIONS CENTER</h1>
          <p className="text-sm text-neutral-400">Mission planning and execution oversight</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">New Operation</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Mission Brief</Button>
        </div>
      </div>
      {/* AI_TIP <OpsStats /> */}
      {/* Stats Overview */}
      <OpsStats />

      {/* Operations List */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-neutral-400">Loading operations...</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-400">Error: {error}</div>
        </div>
      )}
      {/** AI_TIP <OpsOperationThumbnail /> */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {operations.map((operation) => (
          <OpsOperationThumbnail
            key={operation.id}
            operation={operation}
            onSelect={setSelectedOperation}
          />
        ))}
        </div>
      )}
      
      {/* Operation Detail Modal */}
      {selectedOperation && (
        <OpsOperationDetails
          operation={selectedOperation}
          onClose={() => setSelectedOperation(null)}
        />
      )}
    </div>
  )
}
