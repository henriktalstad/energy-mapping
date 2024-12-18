"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import prisma from "@/app/utils/db"
import { auth } from "@/app/utils/auth"

// brukerskjema
const userSchema = z.object({
  firstName: z.string().min(2, "Fornavn må være minst 2 tegn"),
  lastName: z.string().min(2, "Etternavn må være minst 2 tegn"),
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(8, "Passordet må være minst 8 tegn"),
})

export async function getUserData(email: string) {
  const data = await prisma.user.findUnique({
    where: { email },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  return data
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Du må være logget inn for å oppdatere profilen din")
  }

  const validatedFields = userSchema.omit({ password: true }).safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: validatedFields.data,
    })
  } catch {
    return { error: "Kunne ikke oppdatere profilen" }
  }

  revalidatePath("/dashboard/profile")
  redirect("/dashboard/profile")
}

export async function registerUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { firstName, lastName, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "E-postadressen er allerede i bruk" }
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password, // Passord lagres uten hashing
      },
    })

    revalidatePath("/login")
    redirect("/login")
  } catch {
    return { error: "Kunne ikke registrere bruker" }
  }
}
