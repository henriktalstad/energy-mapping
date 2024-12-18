import prisma from "@/app/utils/db"
import { notFound } from 'next/navigation'

type Params = Promise<{ projectId: string }>;

export default async function ProjectPage({ params }: { params: Params }) {
    const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { building: true }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
      <h2 className="text-2xl font-semibold mb-4">Bygning</h2>
      {project.building && <p>{project.building.name}</p>}
      <h2 className="text-2xl font-semibold my-4">Plantegninger</h2>
      <ul className="list-disc pl-5">
        {JSON.parse(project.floorPlan || '[]').map((plan: string, index: number) => (
          <li key={index}>{plan}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold my-4">Fasadetegninger</h2>
      <ul className="list-disc pl-5">
        {JSON.parse(project.fascadeDrawing || '[]').map((drawing: string, index: number) => (
          <li key={index}>{drawing}</li>
        ))}
      </ul>
    </div>
  )
}

