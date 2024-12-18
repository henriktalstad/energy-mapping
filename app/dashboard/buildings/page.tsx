import { Suspense } from "react"
import { BuildingList } from "@/app/components/buildings/building-list"
import { CreateBuildingDialog } from "@/app/components/buildings/create-building-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

export default function BuildingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bygninger</h1>
        <CreateBuildingDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Legg til bygning
          </Button>
        </CreateBuildingDialog>
      </div>
      <Suspense fallback={<div>Laster bygninger...</div>}>
        <BuildingList />
      </Suspense>
    </div>
  )
}

