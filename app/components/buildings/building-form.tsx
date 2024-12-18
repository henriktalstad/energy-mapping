"use client"

import { useState } from "react"
import { Building } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBuilding, updateBuilding } from "@/app/actions/buildings"
import { toast } from "sonner"

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

type BuildingFormValues = z.infer<typeof buildingSchema>

interface BuildingFormProps {
  building?: Building
  onSuccess?: () => void
}

export function BuildingForm({ building, onSuccess }: BuildingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: building
      ? {
          ...building,
          constructionYear: (building.constructionYear ?? "").toString(),
          floorArea: (building.floorArea ?? "").toString(),
        }
      : {
          name: "",
          address: "",
          postalCode: "",
          city: "",
          buildingType: "",
          constructionYear: "",
          floorArea: "",
        },
  })

  async function onSubmit(data: BuildingFormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = building
        ? await updateBuilding(building.id, formData)
        : await createBuilding(formData)

      if (result && 'error' in result) {
        if (typeof result.error === 'string') {
          toast.error(result.error)
        } else {
          // Handle field-specific errors
          Object.entries(result.error ?? {}).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach(error => form.setError(field as keyof BuildingFormValues, { message: error }))
            }
          })
          toast.error("Vennligst korriger feilene i skjemaet")
        }
      } else {
        // If no error, the action was successful
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Kunne ikke lagre bygning:", error)
      if (error instanceof Error) {
        toast.error(`En feil oppstod: ${error.message}`)
      } else {
        toast.error("En uventet feil oppstod")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bygningsnavn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn bygningsnavn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Postnummer</FormLabel>
                <FormControl>
                  <Input placeholder="Skriv inn postnummer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>By</FormLabel>
                <FormControl>
                  <Input placeholder="Skriv inn by" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="buildingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bygningstype</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg bygningstype" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="residential">Bolig</SelectItem>
                  <SelectItem value="commercial">Næring</SelectItem>
                  <SelectItem value="industrial">Industri</SelectItem>
                  <SelectItem value="public">Offentlig</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="constructionYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Byggeår</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Skriv inn byggeår" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floorArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gulvareal (m²)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Skriv inn gulvareal" {...field} step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Lagrer..." : building ? "Oppdater bygning" : "Opprett bygning"}
        </Button>
      </form>
    </Form>
  )
}

