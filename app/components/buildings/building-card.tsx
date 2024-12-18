"use client"

import { Building } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from "react"
import { EditBuildingDialog } from "@/app/components/buildings/edit-building-dialog"
import { deleteBuilding } from "@/app/actions/buildings"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BuildingCardProps {
  building: Building
}

export function BuildingCard({ building }: BuildingCardProps) {
  const [, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Er du sikker på at du vil slette denne bygningen?")) {
      const result = await deleteBuilding(building.id)
      if (result && 'error' in result) {
        toast.error(result.error)
      } else {
        toast.success("Bygning slettet")
        router.refresh()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{building.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Adresse:</strong> {building.address}, {building.postalCode} {building.city}</p>
        <p><strong>Type:</strong> {building.buildingType}</p>
        <p><strong>Byggeår:</strong> {building.constructionYear}</p>
        <p><strong>Gulvareal:</strong> {building.floorArea} m²</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <EditBuildingDialog building={building} onOpenChange={setIsEditDialogOpen}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Rediger
          </Button>
        </EditBuildingDialog>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Slett
        </Button>
      </CardFooter>
    </Card>
  )
}

