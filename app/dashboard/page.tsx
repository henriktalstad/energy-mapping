import { Suspense } from "react";
import { DashboardBlocks } from "../components/DashboardBlocks";
import { EmptyState } from "../components/EmptyState";
import { EnergyUsageGraph } from "../components/EnergyUsageGraph";
import { RecentProjects } from "../components/RecentProjects";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { Skeleton } from "@/components/ui/skeleton";

async function getData(userId: string) {
  const data = await prisma.project.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return data;
}

export default async function DashboardRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyState
          title="Ingen prosjekter funnet"
          description="Klikk på knappen under for å starte et nytt energikartleggingsprosjekt."
          buttontext="Start nytt prosjekt"
          href="/dashboard/projects/create"
        />
      ) : (
        <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
          <DashboardBlocks />
          <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
            <EnergyUsageGraph className="lg:col-span-2" />
            <RecentProjects projects={data} />
          </div>
        </Suspense>
      )}
    </>
  );
}

