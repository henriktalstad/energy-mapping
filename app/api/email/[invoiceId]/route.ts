import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();
    if (!session.user) {
      return NextResponse.redirect("/login");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
    });
    if (!user) {
      return NextResponse.redirect("/login");
    }

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: invoiceData.fromEmail,
      name: `${invoiceData.fromName}`,
    };

    emailClient.send({
      from: sender,
      to: [{ email: invoiceData.clientEmail }],
      template_uuid: "a1fc04b7-2098-476b-935d-b5846a9e4f12",
      template_variables: {
        client_name: invoiceData.clientName,
        company_info_name: invoiceData.fromCompany,
        company_info_address: invoiceData.fromAddress,
        company_info_email: invoiceData.fromEmail,
        invoice_number: invoiceData.invoiceNumber,
        date: invoiceData.date.toLocaleDateString("nb-NO"),
        due_date: invoiceData.dueDate.toLocaleDateString("nb-NO"),
        total_amount: invoiceData.totalInclVat,
        currency: invoiceData.currency,
        invoice_link: 
        process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${invoiceData.id}`
            : `https://invoice.scoped.no/api/invoice/${invoiceData.id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
