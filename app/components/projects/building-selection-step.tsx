"use client"

import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getBuildings } from '@/app/actions/buildings'

interface Building {
  id: string
  name: string
}

interface BuildingSelectionStepProps {
  selectedBuilding: string | null
  setSelectedBuildingAction: (buildingId: string) => void
}

export function BuildingSelectionStep({ selectedBuilding, setSelectedBuildingAction }: BuildingSelectionStepProps) {
  const [buildings, setBuildings] = useState<Building[]>([])

  useEffect(() => {
    const fetchBuildings = async () => {
      const fetchedBuildings = await getBuildings()
      setBuildings(fetchedBuildings)
    }
    fetchBuildings()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Velg bygning</h2>
      <RadioGroup value={selectedBuilding || undefined} onValueChange={setSelectedBuildingAction}>
        {buildings.map(building => (
          <div key={building.id} className="flex items-center space-x-2">
            <RadioGroupItem value={building.id} id={building.id} />
            <Label htmlFor={building.id}>{building.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

