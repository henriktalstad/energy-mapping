import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import Link from "next/link"
import prisma from "@/app/utils/db"

async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      building: true
    }
  })
  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Alle prosjekter</h2>
        <Link href="/dashboard/projects/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nytt prosjekt
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prosjektnavn</TableHead>
            <TableHead>Byggnavn</TableHead>
            <TableHead>Bygningstype</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Opprettet</TableHead>
            <TableHead>Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.building ? project.building.buildingType : 'N/A'}</TableCell>
              <TableCell>{project.building ? project.building.address : 'N/A'}</TableCell>
              <TableCell>{new Date(project.createdAt).toLocaleDateString('no-NO')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <form action={`/api/projects/${project.id}/delete`} method="POST">
                    <Button variant="outline" size="icon" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

