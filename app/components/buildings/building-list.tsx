import { getBuildings } from "@/app/actions/buildings"
import { BuildingCard } from "@/app/components/buildings/building-card"
import { Building } from "@prisma/client"

export async function BuildingList() {
  const buildings = await getBuildings()

  if (buildings.length === 0) {
    return <p>Ingen bygninger funnet. Legg til en ny bygning for å komme i gang.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {buildings.map((building: Building) => (
        <BuildingCard key={building.id} building={building} />
      ))}
    </div>
  )
}

