"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/app/utils/db"
import { auth } from "@/app/utils/auth"

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Du må være logget inn for å opprette et prosjekt" }
  }

  const name = formData.get('name') as string
  const buildingId = formData.get('buildingId') as string
  const floorPlans = formData.getAll('floorPlans') as File[]
  const facadeDrawings = formData.getAll('facadeDrawings') as File[]

  if (!name || !buildingId) {
    return { error: "Manglende prosjektnavn eller bygning" }
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        buildingId,
        userId: session.user.id,
        // Here you would typically upload the files to a storage service
        // and save the URLs or file identifiers in the database
        // For now, we'll just store the file names as a JSON string
        floorPlan: JSON.stringify(floorPlans.map(file => file.name)),
        fascadeDrawing: JSON.stringify(facadeDrawings.map(file => file.name)),
      }
    })

    revalidatePath('/dashboard/projects')
    return { id: project.id }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { error: "Kunne ikke opprette prosjekt" }
  }
}
