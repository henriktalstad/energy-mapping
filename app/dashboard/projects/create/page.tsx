"use client"

import { useState } from 'react'
import { ProjectCreationForm } from '@/app/components/projects/project-creation-form'
import { LoadingPage } from '@/app/components/loading-page'

export default function CreateProjectPage() {
  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Opprett nytt prosjekt</h1>
      <ProjectCreationForm setIsLoadingAction={setIsLoading} />
    </div>
  )
}

