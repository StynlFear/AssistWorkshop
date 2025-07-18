"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddAgentModalProps {
  onClose: () => void
  onAgentAdded: () => void
}

export default function AddAgentModal({ onClose, onAgentAdded }: AddAgentModalProps) {
  const [formData, setFormData] = useState({
    agentId: "",
    name: "",
    status: "standby",
    location: "",
    riskLevel: "low"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      onAgentAdded()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-white tracking-wider">DEPLOY AGENT</CardTitle>
            <p className="text-sm text-neutral-400">Add new field operative</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentId" className="text-xs text-neutral-400 tracking-wider">
                AGENT ID
              </Label>
              <Input
                id="agentId"
                type="text"
                value={formData.agentId}
                onChange={(e) => handleInputChange('agentId', e.target.value)}
                placeholder="Enter agent ID"
                required
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-neutral-400 tracking-wider">
                NAME
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter agent name"
                required
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs text-neutral-400 tracking-wider">
                LOCATION
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
                required
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs text-neutral-400 tracking-wider">
                STATUS
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  <SelectItem value="active" className="text-white hover:bg-neutral-700">Active</SelectItem>
                  <SelectItem value="standby" className="text-white hover:bg-neutral-700">Standby</SelectItem>
                  <SelectItem value="training" className="text-white hover:bg-neutral-700">Training</SelectItem>
                  <SelectItem value="compromised" className="text-white hover:bg-neutral-700">Compromised</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel" className="text-xs text-neutral-400 tracking-wider">
                RISK LEVEL
              </Label>
              <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange('riskLevel', value)}>
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  <SelectItem value="low" className="text-white hover:bg-neutral-700">Low</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-neutral-700">Medium</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-neutral-700">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-neutral-600 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? "Deploying..." : "Deploy Agent"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
