"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUploader } from '@/app/components/file-uploader'

interface ProjectDetailsStepProps {
  projectName: string
  setProjectNameAction: (name: string) => void
  floorPlans: File[]
  setFloorPlansAction: (files: File[]) => void
  facadeDrawings: File[]
  setFacadeDrawingsAction: (files: File[]) => void
}

export function ProjectDetailsStep({
  projectName,
  setProjectNameAction,
  setFloorPlansAction,
setFacadeDrawingsAction,
}: ProjectDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Prosjektnavn</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectNameAction(e.target.value)}
          placeholder="Skriv inn prosjektnavn"
        />
      </div>
      <div className="space-y-2">
        <Label>Plantegninger</Label>
        <FileUploader
          acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
          maxFileSizeInBytes={5 * 1024 * 1024}
          label="Last opp plantegninger"
          updateFilesCbAction={setFloorPlansAction}
        />
      </div>
      <div className="space-y-2">
        <Label>Fasadetegninger</Label>
        <FileUploader
          acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
          maxFileSizeInBytes={5 * 1024 * 1024}
          label="Last opp fasadetegninger"
          updateFilesCbAction={setFacadeDrawingsAction}
        />
      </div>
    </div>
  )
}

