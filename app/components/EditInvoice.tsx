"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceTotal } from "./InvoiceTotal";
import { CalendarIcon, Trash2, PlusCircle } from 'lucide-react';
import { useActionState, useState  } from "react";
import { SubmitButton } from "./SubmitButtons";
import { editInvoice } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "../utils/zodSchemas";
import { formatCurrency } from "../utils/formatCurrency";
import { Prisma } from "@prisma/client";

interface iAppProps {
  data: Prisma.InvoiceGetPayload<{
    include: { items: true };
  }>;
}

interface Items {
  description: string;
  quantity: string;
  rate: string;
}

export default function EditInvoice({
 data
}: iAppProps) {
  const [lastResult, action] = useActionState(editInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      id: data.id,
      invoiceName: data.invoiceName,
      invoiceNumber: data.invoiceNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      note: data.note,
      fromCompany: data.fromCompany,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
      fromAddress: data.fromAddress,
      fromAccountNumber: data.fromAccountNumber,
      currency: data.currency,
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity.toString(),
        rate: item.rate.toString(),
      })),
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date(data.dueDate));
  const [products, setProducts] = useState<Items[]>(data.items.map((item) => ({
    description: item.description,
    quantity: item.quantity.toString(),
    rate: item.rate.toString(),
  })));
  const [currency, setCurrency] = useState(data.currency);

  const addProduct = () => {
    setProducts([...products, { description: "", quantity: "", rate: "" }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Items, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (Number(product.quantity) || 0) * (Number(product.rate) || 0);
    }, 0);
  };

  const total = calculateTotal();
  const vatRate = 0.25; // 25% VAT rate
  const vatAmount = total * vatRate;
  const totalIncludingVAT = total + vatAmount;
  const today = new Date();

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10 mb-20">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
        
        <input type="hidden" name="date" value={today.toISOString()} />
          <input type="hidden" name="dueDate" value={selectedDate.toISOString()} />
          <input type="hidden" name="total" value={total} />
          <input type="hidden" name="vat" value={vatAmount} />
          <input type="hidden" name="totalIncldVat" value={totalIncludingVAT} />
          <input type="hidden" name="id" value={data.id} />
          

          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Fakturautkast</Badge>
              <Input
                name={fields.invoiceName.name}
                defaultValue={fields.invoiceName.value}
                placeholder="Fakturanavn"
              />
            </div>
            <p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label>Fakturanr.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  defaultValue={fields.invoiceNumber.value}
                  className="rounded-l-none"
                  placeholder="#Fakturanr."
                />
              </div>
              <p className="text-red-500 text-sm">{fields.invoiceNumber.errors}</p>
            </div>

            <div>
              <Label>Valuta</Label>
              <Select
                name={fields.currency.name}
                defaultValue={fields.currency.value}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg valuta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOK">Norske kroner -- NOK</SelectItem>
                  <SelectItem value="USD">Amerikanske dollar -- USD</SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Fra</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromCompany.name}
                  defaultValue={fields.fromCompany.value}
                  placeholder="Ditt selskap"
                />
                <p className="text-red-500 text-sm">{fields.fromCompany.errors}</p>
                <Input
                  name={fields.fromName.name}
                  defaultValue={fields.fromName.value}
                  placeholder="Ditt navn"
                />
                <p className="text-red-500 text-sm">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  defaultValue={fields.fromEmail.value}
                  placeholder="Din e-post"
                />
                <p className="text-red-500 text-sm">{fields.fromEmail.errors}</p>
                <Input
                  name={fields.fromAddress.name}
                  defaultValue={fields.fromAddress.value}
                  placeholder="Din adresse"
                />
                <p className="text-red-500 text-sm">{fields.fromAddress.errors}</p>
                <Input
                  name={fields.fromAccountNumber.name}
                  defaultValue={fields.fromAccountNumber.value}
                  placeholder="Ditt kontonummer"
                />
                <p className="text-red-500 text-sm">{fields.fromAccountNumber.errors}</p>
              </div>
            </div>

            <div>
              <Label>Til</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  defaultValue={fields.clientName.value}
                  placeholder="Kundens navn"
                />
                <p className="text-red-500 text-sm">{fields.clientName.errors}</p>
                <Input
                  name={fields.clientEmail.name}
                  defaultValue={fields.clientEmail.value}
                  placeholder="Kundens e-post"
                />
                <p className="text-red-500 text-sm">{fields.clientEmail.errors}</p>
                <Input
                  name={fields.clientAddress.name}
                  defaultValue={fields.clientAddress.value}
                  placeholder="Kundens adresse"
                />
                <p className="text-red-500 text-sm">{fields.clientAddress.errors}</p>
              <div>
                <Label>Forfallsdato</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[280px] text-left justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("no-NO", {
                        dateStyle: "long",
                      }).format(selectedDate)
                    ) : (
                      <span>Velg forfallsdato</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    mode="single"
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-5">Beskrivelse</p>
              <p className="col-span-2">Antall</p>
              <p className="col-span-2">Pris</p>
              <p className="col-span-2">Beløp</p>
              <p className="col-span-1"></p>
            </div>

            {products.map((product, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <input type="hidden" name={`items[${index}].description`} value={product.description} />
                  <input type="hidden" name={`items[${index}].quantity`} value={product.quantity} />
                  <input type="hidden" name={`items[${index}].rate`} value={product.rate} />
                  <Textarea
                    value={product.description}
                    onChange={(e) => updateProduct(index, "description", e.target.value)}
                    placeholder="Produktnavn og beskrivelse"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={product.quantity}
                    onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={product.rate}
                    onChange={(e) => updateProduct(index, "rate", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={formatCurrency({
                      amount: (Number(product.quantity) || 0) * (Number(product.rate) || 0),
                      currency: currency as any,
                    })}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button type="button" onClick={addProduct} className="mb-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Legg til produkt
            </Button>
          </div>

          <InvoiceTotal total={total} currency={currency as any} />

          <div>
            <Label>Notat</Label>
            <Textarea
              name={fields.note.name}
              defaultValue={fields.note.value}
              placeholder="Notat til fakturaen (valgfritt).."
            />
            <p className="text-red-500 text-sm">{fields.note.errors}</p>
          </div>

          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButton text="Endre og send oppdatert faktura" variant={"default"} />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

