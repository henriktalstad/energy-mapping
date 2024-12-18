"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BuildingForm } from "@/app/components/buildings/building-form"
import { toast } from "sonner"

interface CreateBuildingDialogProps {
  children: React.ReactNode
}

export function CreateBuildingDialog({ children }: CreateBuildingDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setOpen(false)
    toast.success("Bygning opprettet")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til ny bygning</DialogTitle>
        </DialogHeader>
        <BuildingForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

