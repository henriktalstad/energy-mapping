import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromCompany: true,
      fromAccountNumber: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      date: true,
      dueDate: true,
      vat: true,
      totalInclVat: true,
      items: {
        select: {
          description: true,
          quantity: true,
          rate: true,
        },
      },
      total: true,
      note: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Faktura ble ikke funnet" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper function to add text with proper line breaks
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + index * lineHeight);
    });
    return lines.length * lineHeight;
  };

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(44, 62, 80); // Dark blue color
  pdf.text(data.invoiceName, 20, 20);

  pdf.setFontSize(12);
  pdf.setTextColor(52, 73, 94); // Slightly lighter blue
  pdf.text(`Fakturanummer: #${data.invoiceNumber}`, 20, 30);

  // From Section
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text("Fra:", 20, 45);
  pdf.setFontSize(10);
  pdf.setTextColor(52, 73, 94);
  let yPos = 50;
  yPos += addWrappedText(data.fromCompany, 20, yPos, 80, 5);
  yPos += addWrappedText(data.fromName, 20, yPos, 80, 5);
  yPos += addWrappedText(data.fromEmail, 20, yPos, 80, 5);
  yPos += addWrappedText(data.fromAddress, 20, yPos, 80, 5);
  yPos += addWrappedText(`Kontonummer: ${data.fromAccountNumber}`, 20, yPos, 80, 5);

  // Client Section
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text("Til:", 120, 45);
  pdf.setFontSize(10);
  pdf.setTextColor(52, 73, 94);
  yPos = 50;
  yPos += addWrappedText(data.clientName, 120, yPos, 70, 5);
  yPos += addWrappedText(data.clientEmail, 120, yPos, 70, 5);
  yPos += addWrappedText(data.clientAddress, 120, yPos, 70, 5);

  // Invoice details
  pdf.setFontSize(10);
  pdf.setTextColor(52, 73, 94);
  pdf.text(`Dato: ${new Intl.DateTimeFormat("no-NO", { dateStyle: "long" }).format(data.date)}`, 120, 80);
  pdf.text(`Forfallsdato: ${new Intl.DateTimeFormat("no-NO", { dateStyle: "long" }).format(data.dueDate)}`, 120, 85);

  // Item table
  const tableTop = 100;
  const tableLeft = 20;
  const colWidths = [80, 30, 30, 30];

  // Table header
  pdf.setFillColor(44, 62, 80);
  pdf.rect(tableLeft, tableTop, pdf.internal.pageSize.width - 40, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text("Beskrivelse", tableLeft + 2, tableTop + 6);
  pdf.text("Antall", tableLeft + colWidths[0] + 2, tableTop + 6);
  pdf.text("Pris", tableLeft + colWidths[0] + colWidths[1] + 2, tableTop + 6);
  pdf.text("Total", tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 2, tableTop + 6);

  // Table content
  let tableY = tableTop + 10;
  pdf.setTextColor(52, 73, 94);

  data.items.forEach((item, index) => {
    const y = tableY + index * 10;
    addWrappedText(item.description, tableLeft + 2, y + 5, colWidths[0] - 4, 5);
    pdf.text(item.quantity.toString(), tableLeft + colWidths[0] + 2, y + 5);
    pdf.text(formatCurrency({ amount: item.rate, currency: data.currency as any }), tableLeft + colWidths[0] + colWidths[1] + 2, y + 5);
    pdf.text(formatCurrency({ amount: item.quantity * item.rate, currency: data.currency as any }), tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 5);
  });

  // Total Section
  const totalY = tableY + data.items.length * 10 + 10;
  pdf.line(tableLeft, totalY, pdf.internal.pageSize.width - 20, totalY);
  pdf.setFont("helvetica", "normal");
  pdf.text("Subtotal:", tableLeft + colWidths[0] + colWidths[1], totalY + 10);
  pdf.text(formatCurrency({ amount: data.total, currency: data.currency as any }), tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 2, totalY + 10);

  pdf.text("MVA (25%):", tableLeft + colWidths[0] + colWidths[1], totalY + 20);
  pdf.text(formatCurrency({ amount: data.vat, currency: data.currency as any }), tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 2, totalY + 20);

  pdf.setTextColor(44, 62, 80);
  pdf.setFontSize(12);
  pdf.text("Total inkl. MVA:", tableLeft + colWidths[0] + colWidths[1], totalY + 30);
  pdf.text(formatCurrency({ amount: data.totalInclVat, currency: data.currency as any }), tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 2, totalY + 30);

  // Additional Note
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(52, 73, 94);
    pdf.text("Notat:", 20, totalY + 50);
    addWrappedText(data.note, 20, totalY + 55, pdf.internal.pageSize.width - 40, 5);
  }

  // Footer
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(149, 165, 166);
  pdf.text("Takk for din forretning!", pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: "center" });

  // Generate PDF as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  // Return PDF as download
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=invoice.pdf",
    },
  });
}

