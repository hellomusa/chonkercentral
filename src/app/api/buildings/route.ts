import { NextResponse } from 'next/server'
import { getBuildings } from '@/lib/db'

export async function GET() {
  try {
    const buildings = await getBuildings()
    return NextResponse.json(buildings)
  } catch (error) {
    console.error('Failed to fetch buildings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buildings' },
      { status: 500 }
    )
  }
}
