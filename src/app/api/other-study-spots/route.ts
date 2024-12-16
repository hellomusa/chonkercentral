import { NextResponse } from 'next/server'
import { getStudySpots } from '@/lib/db'

export async function GET() {
  try {
    const spots = await getStudySpots()
    return NextResponse.json(spots.slice(0, 5))
  } catch (error) {
    console.error('Failed to fetch other study spots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch other study spots' },
      { status: 500 }
    )
  }
}
