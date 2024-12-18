"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";
import { revalidatePath } from "next/cache";

export async function getUserData(email: string) {
  const data = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      onboarded: true,
      firstName: true,
      lastName: true,
      address: true,
      company: true,
      accountNumber: true,
    },
  });

  return data;
}

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      email: session.user?.email as string,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
      accountNumber: submission.value.accountNumber,
      company: submission.value.company,
      onboarded: true,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  try {
    const session = await requireUser();
    if (!session?.user) {
      return redirect("/login");
    }

    const submission = parseWithZod(formData, {
      schema: invoiceSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceName: submission.value.invoiceName,
        invoiceNumber: submission.value.invoiceNumber,
        currency: submission.value.currency,
        date: new Date(submission.value.date),
        dueDate: new Date(submission.value.dueDate),
        fromCompany: submission.value.fromCompany,
        fromAccountNumber: submission.value.fromAccountNumber,
        fromAddress: submission.value.fromAddress,
        fromEmail: submission.value.fromEmail,
        fromName: submission.value.fromName,
        clientName: submission.value.clientName,
        clientEmail: submission.value.clientEmail,
        clientAddress: submission.value.clientAddress,
        status: "VENTENDE",
        total: submission.value.total,
        totalInclVat: submission.value.totalIncldVat,
        vat: submission.value.vat,
        note: submission.value.note,
        userId: session.user.id,
        items: {
          create: submission.value.items.map((item) => ({
            description: item.description,
            quantity: parseInt(item.quantity.toString()),
            rate: parseFloat(item.rate.toString()),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const sender = {
      email: submission.value.fromEmail,
      name: submission.value.fromName,
    };

    await emailClient.send({
      from: sender,
      to: [{ email: submission.value.clientEmail }],
      template_uuid: "03eb7442-fe7e-482b-b602-0482a0d0d794",
      template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        date: new Intl.DateTimeFormat("no-NO", {
          dateStyle: "short",
        }).format(new Date(submission.value.date)),
        dueDate: new Intl.DateTimeFormat("no-NO", {
          dateStyle: "short",
        }).format(new Date(submission.value.dueDate)),
        senderName: submission.value.fromName,
        senderEmail: submission.value.fromEmail,
        senderCompany: submission.value.fromCompany,
        totalAmount: formatCurrency({
          amount: submission.value.totalIncldVat,
          currency: submission.value.currency as any,
        }),
        invoiceLink:
          process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${invoice.id}`
            : `https://invoice.scoped.no/api/invoice/${invoice.id}`,
      },
    });

  } catch (error) {
    console.error("Failed to create invoice:", error);
    return undefined;
  }
  revalidatePath("/dashboard/invoices/create");
  redirect("/dashboard/invoices");
};

export async function editInvoice(prevState: any, formData: FormData) {
  try {
    const session = await requireUser();
    if (!session?.user) {
      return redirect("/login");
    }

    const submission = parseWithZod(formData, {
      schema: invoiceSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const items = await prisma.invoiceItem.findMany({
      where: {
        invoiceId: formData.get("id") as string,
      },
    });

    const invoice = await prisma.invoice.update({
      where: {
        id: formData.get("id") as string,
        userId: session.user.id,
      },
      data: {
        invoiceName: submission.value.invoiceName,
        invoiceNumber: submission.value.invoiceNumber,
        currency: submission.value.currency,
        date: new Date(submission.value.date),
        dueDate: new Date(submission.value.dueDate),
        fromCompany: submission.value.fromCompany,
        fromAccountNumber: submission.value.fromAccountNumber,
        fromAddress: submission.value.fromAddress,
        fromEmail: submission.value.fromEmail,
        fromName: submission.value.fromName,
        clientName: submission.value.clientName,
        clientEmail: submission.value.clientEmail,
        clientAddress: submission.value.clientAddress,
        status: "VENTENDE",
        total: submission.value.total,
        totalInclVat: submission.value.totalIncldVat,
        vat: submission.value.vat,
        note: submission.value.note,
        userId: session.user.id,
        items: {
          updateMany: items.map((item) => ({
            where: { id: item.id },
            data: {
              description: item.description,
              quantity: parseInt(item.quantity.toString()),
              rate: parseFloat(item.rate.toString()),
            },
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const sender = {
      email: submission.value.fromEmail,
      name: submission.value.fromName,
    };

    await emailClient.send({
      from: sender,
      to: [{ email: submission.value.clientEmail }],
      template_uuid: "03eb7442-fe7e-482b-b602-0482a0d0d794",
      template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        date: new Intl.DateTimeFormat("no-NO", {
          dateStyle: "short",
        }).format(new Date(submission.value.date)),
        dueDate: new Intl.DateTimeFormat("no-NO", {
          dateStyle: "short",
        }).format(new Date(submission.value.dueDate)),
        senderName: submission.value.fromName,
        senderEmail: submission.value.fromEmail,
        senderCompany: submission.value.fromCompany,
        totalAmount: formatCurrency({
          amount: submission.value.totalIncldVat,
          currency: submission.value.currency as any,
        }),
        invoiceLink:
          process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${invoice.id}`
            : `https://invoice.scoped.no/api/invoice/${invoice.id}`,
      },
    });
    revalidatePath(`/dashboard/invoices/${invoice.id}`)
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return undefined;
  }
  redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await requireUser();
  if (!session.user) {
    return redirect("/login");
  }

  await prisma.invoiceItem.deleteMany({
    where: {
      invoiceId: invoiceId,
    },
  });
   await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user.id,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await requireUser();
  if (!session.user) {
    return redirect("/login");
  }

  const data = await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: "BETALT",
    },
  });

  return redirect("/dashboard/invoices");
}
