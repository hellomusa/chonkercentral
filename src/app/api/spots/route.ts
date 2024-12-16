import { NextResponse } from 'next/server'
import { getAllStudySpots } from '@/lib/db'

export async function GET() {
  try {
    const spots = await getAllStudySpots()
    return NextResponse.json(spots)
  } catch (error) {
    console.error('Failed to fetch study spots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study spots' },
      { status: 500 }
    )
  }
}
