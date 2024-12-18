import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from 'lucide-react';
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export function RecentProjects({ projects }: { projects: Project[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nylige prosjekter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center">
              <Building className="h-9 w-9 text-emerald-500" />
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString('no-NO')}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Link href={`/dashboard/projects/${project.id}`} className="text-emerald-500 hover:underline">
                  Vis
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

