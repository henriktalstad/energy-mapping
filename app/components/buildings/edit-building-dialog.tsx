"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building } from "@prisma/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BuildingForm } from "@/app/components/buildings/building-form"
import { toast } from "sonner"

interface EditBuildingDialogProps {
  building: Building
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function EditBuildingDialog({ building, children, onOpenChange }: EditBuildingDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSuccess = () => {
    handleOpenChange(false)
    toast.success("Bygning oppdatert")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediger bygning</DialogTitle>
        </DialogHeader>
        <BuildingForm building={building} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

