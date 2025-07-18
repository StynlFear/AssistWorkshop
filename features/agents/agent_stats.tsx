"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export function AgentActiveStats() {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 tracking-wider">ACTIVE AGENTS</p>
            <p className="text-2xl font-bold text-white font-mono">847</p>
          </div>
          <Shield className="w-8 h-8 text-white" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AgentCompromisedStats() {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 tracking-wider">COMPROMISED</p>
            <p className="text-2xl font-bold text-red-500 font-mono">3</p>
          </div>
          <Shield className="w-8 h-8 text-red-500" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AgentTrainingStats() {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 tracking-wider">IN TRAINING</p>
            <p className="text-2xl font-bold text-orange-500 font-mono">23</p>
          </div>
          <Shield className="w-8 h-8 text-orange-500" />
        </div>
      </CardContent>
    </Card>
  )
}
