"use client"

import { useState } from 'react'
import { Building, BarChart2, DollarSign, Snowflake, Sun, Home, Settings, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ProjectNode {
  id: string
  name: string
  icon?: React.ReactNode
  children?: ProjectNode[]
}

const projectData: ProjectNode = {
  id: 'root',
  name: 'TEP4235 - v2 (14.11.) 17112024142100',
  children: [
    {
      id: 'office',
      name: 'Kontor',
      icon: <Building className="h-4 w-4" />,
      children: [
        { id: 'year-sim', name: 'Årssimulering', icon: <BarChart2 className="h-4 w-4" /> },
        { id: 'profit-eval', name: 'Lønnsomhetsvurdering 1', icon: <DollarSign className="h-4 w-4" /> },
        { id: 'winter-sim', name: 'Vintersimulering 1', icon: <Snowflake className="h-4 w-4" /> },
        { id: 'summer-sim', name: 'Sommersimulering 1', icon: <Sun className="h-4 w-4" /> },
        { id: 'passive-eval', name: 'Passiv evaluering', icon: <Home className="h-4 w-4" /> },
        { id: 'heating-sys', name: 'Sentralvarmesystem 1', icon: <Settings className="h-4 w-4" /> },
      ]
    },
    {
      id: 'warehouse',
      name: 'Lager',
      icon: <Building className="h-4 w-4" />,
    }
  ]
}

export default function ProjectPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'office']))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const renderNode = (node: ProjectNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)

    return (
      <div key={node.id} className={`ml-${level * 4}`}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleNode(node.id)}>
          <CollapsibleTrigger className="flex items-center gap-2 py-1 text-sm hover:text-emerald-600 w-full">
            {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            {node.icon}
            <span>{node.name}</span>
          </CollapsibleTrigger>
          {hasChildren && (
            <CollapsibleContent>
              {node.children?.map(child => renderNode(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">


      {/* Left sidebar */}
      <div className="w-64 bg-gray-200 border-r border-gray-300 overflow-auto pt-14">
        <div className="p-4">
          <div className="mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            <span className="font-semibold">Røros</span>
          </div>
          {renderNode(projectData)}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pt-14">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Prosjektdata</h1>
            <Button variant="secondary">
              <HelpCircle className="h-4 w-4 mr-2" />
              Hjelp
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Prosjekt-/bygningsnavn</Label>
                <Input
                  id="projectName"
                  value="TEP4235 - v2 (14.11.) 17112024142100"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="projectAddress">Prosjektadresse</Label>
                <Input
                  id="projectAddress"
                  placeholder="Skriv inn prosjektadresse"
                />
              </div>

              <div>
                <Label htmlFor="responsiblePerson">Ansvarlig person</Label>
                <Input
                  id="responsiblePerson"
                  placeholder="Skriv inn ansvarlig person"
                />
              </div>

              <div>
                <Label htmlFor="comments">Kommentarer</Label>
                <Textarea
                  id="comments"
                  placeholder="Skriv inn eventuelle kommentarer"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left toolbar */}
      <div className="fixed ml-5  bottom-0 w-12 bg-gray-700 flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
        </Button>
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 3h18v18H3zM12 8v8"></path><path d="M8 12h8"></path></svg>
        </Button>
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </Button>
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </Button>
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </Button>
        <Button variant="ghost" className="text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </Button>
      </div>
    </div>
  )
}

