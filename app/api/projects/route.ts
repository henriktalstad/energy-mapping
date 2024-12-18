import { NextResponse } from 'next/server'
import prisma from '@/app/utils/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, buildingType, address, constructionYear, floorArea } = body

    const project = await prisma.project.create({
      data: {
        name,
        buildingType,
        address,
        constructionYear: parseInt(constructionYear),
        floorArea: parseFloat(floorArea),
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

