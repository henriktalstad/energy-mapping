import { z, object, string } from "zod";
 
export const signInSchema = object({
  email: string({ required_error: "E-post er påkrevd" })
    .min(1, "E-post er påkrevd")
    .email("Ugyldig e-postadresse"),
  password: string({ required_error: "Passord er påkrevd" })
    .min(1, "Passord er påkrevd")
    .min(8, "Passordet må være mer enn 8 tegn")
    .max(32, "Passordet må være mindre enn 32 tegn"),
})

export const onboardingSchema = z.object({
  firstName: string().min(2, "Fornavn er påkrevd"),
  lastName: string().min(2, "Etternavn er påkrevd"),
  company: string().min(2, "Firmanavn er påkrevd"),
  accountNumber: string().min(2, "Kontonummer er påkrevd"),
  address: string().min(2, "Adresse er påkrevd"),
});

export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceName: z.string().min(1, "Fakturanavn er påkrevd"),
  invoiceNumber: z.coerce.number().min(1, "Fakturanummer er påkrevd"),
  currency: z.string().min(1, "Valuta er påkrevd"),
  date: z.string().min(1, "Dato er påkrevd"),
  dueDate: z.string().min(1, "Forfallsdato er påkrevd"),
  fromCompany: z.string().min(1, "Selskap er påkrevd"),
  fromAccountNumber: z.string().min(1, "Kontonummer er påkrevd"),
  fromAddress: z.string().min(1, "Adresse er påkrevd"),
  fromEmail: z.string().email("Ugyldig e-postadresse"),
  fromName: z.string().min(1, "Navn er påkrevd"),
  clientName: z.string().min(1, "Kundens navn er påkrevd"),
  clientEmail: z.string().email("Ugyldig e-postadresse"),
  clientAddress: z.string().min(1, "Kundens adresse er påkrevd"),
  total: z.coerce.number().min(0, "Totalt beløp må være positivt"),
  totalIncldVat: z.coerce.number().min(0, "Totalt beløp inkl. MVA må være positivt"),
  vat: z.coerce.number().min(0, "MVA må være positiv"),
  note: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, "Produktbeskrivelse er påkrevd"),
      quantity: z.string().min(1, "Antall er påkrevd"),
      rate: z.string().min(1, "Pris er påkrevd"),
    })
  ).min(1, "Minst ett produkt er påkrevd"),
});

