"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuildingSelectionStep } from './building-selection-step'
import { ProjectDetailsStep } from './project-details-step'
import { Button } from '@/components/ui/button'
import { createProject } from '@/app/actions/project'
import { toast } from 'sonner'

interface ProjectCreationFormProps {
  setIsLoadingAction: (isLoading: boolean) => void
}

export function ProjectCreationForm({ setIsLoadingAction }: ProjectCreationFormProps) {
  const [step, setStep] = useState(1)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [floorPlans, setFloorPlans] = useState<File[]>([])
  const [facadeDrawings, setFacadeDrawings] = useState<File[]>([])
  const router = useRouter()

  const handleNextStep = () => {
    if (step === 1 && !selectedBuilding) {
      toast.error('Vennligst velg en bygning')
      return
    }
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim() === '') {
      toast.error('Vennligst skriv inn et prosjektnavn')
      return
    }

    setIsLoadingAction(true)

    const formData = new FormData()
    formData.append('name', projectName)
    formData.append('buildingId', selectedBuilding || '')
    floorPlans.forEach(file => formData.append('floorPlans', file))
    facadeDrawings.forEach(file => formData.append('facadeDrawings', file))

    try {
      const result = await createProject(formData)
      if ('error' in result) {
        toast.error(result.error)
        setIsLoadingAction(false)
      } else {
        toast.success('Prosjekt opprettet')
        router.push(`/dashboard/projects/${result.id}`)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Kunne ikke opprette prosjekt')
      setIsLoading(false, setIsLoadingAction)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {step === 1 && (
        <BuildingSelectionStep
          selectedBuilding={selectedBuilding}
          setSelectedBuildingAction={setSelectedBuilding}
        />
      )}
      {step === 2 && (
        <ProjectDetailsStep
          projectName={projectName}
          setProjectNameAction={setProjectName}
          floorPlans={floorPlans}
          setFloorPlansAction={setFloorPlans}
          facadeDrawings={facadeDrawings}
          setFacadeDrawingsAction={setFacadeDrawings}
        />
      )}
      <div className="flex justify-between">
        {step > 1 && (
          <Button type="button" onClick={handlePreviousStep}>
            Tilbake
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={handleNextStep}>
            Neste
          </Button>
        ) : (
          <Button type="submit">Opprett prosjekt</Button>
        )}
      </div>
    </form>
  )
}
function setIsLoading(isLoading: boolean, setIsLoadingAction: (isLoading: boolean) => void) {
    setIsLoadingAction(isLoading)
}

