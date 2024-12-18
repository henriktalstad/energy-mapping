"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

export default function CreateProject() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buildingType: '',
    address: '',
    constructionYear: '',
    floorArea: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, buildingType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Prosjekt opprettet')
        router.push('/dashboard/projects')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create project')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke opprette prosjekt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Opprett nytt energikartleggingsprosjekt</CardTitle>
        <CardDescription>Fyll ut informasjonen under for å starte et nytt prosjekt.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Prosjektnavn</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Skriv inn prosjektnavn"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Kort beskrivelse av prosjektet"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buildingType">Bygningstype</Label>
            <Select onValueChange={handleSelectChange} value={formData.buildingType}>
              <SelectTrigger id="buildingType">
                <SelectValue placeholder="Velg bygningstype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Kontor</SelectItem>
                <SelectItem value="residential">Bolig</SelectItem>
                <SelectItem value="school">Skole</SelectItem>
                <SelectItem value="hospital">Sykehus</SelectItem>
                <SelectItem value="other">Annet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Bygningens adresse"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="constructionYear">Byggeår</Label>
            <Input
              id="constructionYear"
              name="constructionYear"
              type="number"
              value={formData.constructionYear}
              onChange={handleInputChange}
              placeholder="Året bygningen ble oppført"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floorArea">Bruksareal (BRA) i m²</Label>
            <Input
              id="floorArea"
              name="floorArea"
              type="number"
              value={formData.floorArea}
              onChange={handleInputChange}
              placeholder="Totalt bruksareal"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Oppretter...' : 'Opprett prosjekt'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

