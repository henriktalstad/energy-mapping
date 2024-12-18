import { CreateInvoice } from "@/app/components/CreateInvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { redirect } from "next/navigation";

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
      company: true,
      accountNumber: true,
    },
  });

  return data;
}

export default async function InvoiceCreationRoute() {
  const session = await requireUser();
  if (!session.user) {
    return redirect("/login");
  }
  const data = await getUserData(session.user?.id as string);
  return (
    <CreateInvoice
      lastName={data?.lastName as string}
      address={data?.address as string}
      email={data?.email as string}
      firstName={data?.firstName as string}
      company={data?.company as string}
      accountNumber={data?.accountNumber as string}
    />
  );
}
