"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploader } from '@/app/components/file-uploader'
import { createProject } from '@/app/actions/project'
import { getBuildings } from '@/app/actions/buildings'
import { toast } from 'sonner'
import { Building, Loader2 } from 'lucide-react'

interface Building {
  id: string
  name: string
}

interface ProjectCreationFormProps {
  setIsLoadingAction: (isLoading: boolean) => void
}

export function ProjectCreationForm({ setIsLoadingAction }: ProjectCreationFormProps) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [floorPlans, setFloorPlans] = useState<File[]>([])
  const [facadeDrawings, setFacadeDrawings] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchBuildings = async () => {
      const fetchedBuildings = await getBuildings()
      setBuildings(fetchedBuildings)
    }
    fetchBuildings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBuilding) {
      toast.error('Vennligst velg en bygning')
      return
    }
    if (projectName.trim() === '') {
      toast.error('Vennligst skriv inn et prosjektnavn')
      return
    }

    setIsSubmitting(true)
    setIsLoadingAction(true)

    const formData = new FormData()
    formData.append('name', projectName)
    formData.append('buildingId', selectedBuilding)
    floorPlans.forEach(file => formData.append('floorPlans', file))
    facadeDrawings.forEach(file => formData.append('facadeDrawings', file))

    try {
      const result = await createProject(formData)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success('Prosjekt opprettet')
        router.push(`/dashboard/projects/${result.id}`)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Kunne ikke opprette prosjekt')
    } finally {
      setIsSubmitting(false)
      setIsLoadingAction(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Velg bygning</h2>
              <RadioGroup value={selectedBuilding || undefined} onValueChange={setSelectedBuilding}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildings.map(building => (
                    <div key={building.id} className="flex items-center space-x-2 bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value={building.id} id={building.id} />
                      <Label htmlFor={building.id} className="flex items-center cursor-pointer">
                        <Building className="h-5 w-5 mr-2 text-emerald-500" />
                        {building.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Prosjektnavn</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Skriv inn prosjektnavn"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Plantegninger</Label>
              <FileUploader
                acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                maxFileSizeInBytes={5 * 1024 * 1024}
                label="Last opp plantegninger"
                updateFilesCbAction={setFloorPlans}
              />
            </div>

            <div className="space-y-2">
              <Label>Fasadetegninger</Label>
              <FileUploader
                acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                maxFileSizeInBytes={5 * 1024 * 1024}
                label="Last opp fasadetegninger"
                updateFilesCbAction={setFacadeDrawings}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Oppretter prosjekt...
            </>
          ) : (
            'Opprett prosjekt'
          )}
        </Button>
      </div>
    </form>
  )
}

