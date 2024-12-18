import { ReactNode } from "react"

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-6">
      {children}
    </div>
  )
}

