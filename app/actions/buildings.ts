"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from '@/app/utils/db'
import { auth } from "@/app/utils/auth"

// Bygning-skjema
const buildingSchema = z.object({
  name: z.string().min(2, "Navn må være minst 2 tegn"),
  address: z.string().min(5, "Adresse må være minst 5 tegn"),
  postalCode: z.string().min(4, "Postnummer må være minst 4 tegn"),
  city: z.string().min(2, "By må være minst 2 tegn"),
  buildingType: z.string().min(1, "Bygningstype er påkrevd"),
  constructionYear: z.string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 1800, {
      message: "Byggeår må være et gyldig årstall fra 1800 og oppover",
    }),
  floorArea: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Gulvareal må være et positivt tall",
    }),
})

async function getUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Du må være logget inn for å utføre denne handlingen")
  }
  return session.user.id
}

export async function createBuilding(formData: FormData) {
  const userId = await getUserId()

  const validatedFields = buildingSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    buildingType: formData.get("buildingType"),
    constructionYear: formData.get("constructionYear"),
    floorArea: formData.get("floorArea"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const { constructionYear, floorArea, ...rest } = validatedFields.data
    await prisma.building.create({
      data: {
        ...rest,
        constructionYear: parseInt(constructionYear),
        floorArea: parseFloat(floorArea),
        userId: userId,
      },
    })

    revalidatePath("/dashboard/buildings")
    return { success: true }
  } catch (error) {
    console.error("Feil ved oppretting av bygning:", error)
    if (error instanceof Error) {
      return { error: `Kunne ikke opprette bygning: ${error.message}` }
    }
    return { error: "Kunne ikke opprette bygning" }
  }
}

export async function updateBuilding(id: string, formData: FormData) {
  const userId = await getUserId()

  const validatedFields = buildingSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    buildingType: formData.get("buildingType"),
    constructionYear: formData.get("constructionYear"),
    floorArea: formData.get("floorArea"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const building = await prisma.building.findUnique({
      where: { id },
    })

    if (!building) {
      throw new Error("Bygning ikke funnet")
    }

    if (building.userId !== userId) {
      throw new Error("Du har ikke tillatelse til å oppdatere denne bygningen")
    }

    const { constructionYear, floorArea, ...rest } = validatedFields.data
    await prisma.building.update({
      where: { id },
      data: {
        ...rest,
        constructionYear: parseInt(constructionYear),
        floorArea: parseFloat(floorArea),
      },
    })

    revalidatePath("/dashboard/buildings")
    return { success: true }
  } catch (error) {
    console.error("Feil ved oppdatering av bygning:", error)
    if (error instanceof Error) {
      return { error: `Kunne ikke oppdatere bygning: ${error.message}` }
    }
    return { error: "Kunne ikke oppdatere bygning" }
  }
}

export async function deleteBuilding(id: string) {
  const userId = await getUserId()

  try {
    const building = await prisma.building.findUnique({
      where: { id },
    })

    if (!building) {
      throw new Error("Bygning ikke funnet")
    }

    if (building.userId !== userId) {
      throw new Error("Du har ikke tillatelse til å slette denne bygningen")
    }

    await prisma.building.delete({ where: { id } })
    revalidatePath("/dashboard/buildings")
    return { success: true }
  } catch (error) {
    console.error("Feil ved sletting av bygning:", error)
    if (error instanceof Error) {
      return { error: `Kunne ikke slette bygning: ${error.message}` }
    }
    return { error: "Kunne ikke slette bygning" }
  }
}

export async function getBuildings() {
  const userId = await getUserId()

  try {
    const buildings = await prisma.building.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    })
    return buildings
  } catch (error) {
    console.error("Feil ved henting av bygninger:", error)
    throw new Error("Kunne ikke hente bygninger")
  }
}

