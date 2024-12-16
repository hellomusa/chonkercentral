import { NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/libcal'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const date = new Date(dateParam)
    console.log(date)
    const availability = await checkAvailability(date)

    console.log('availability', availability)

    // Convert Map to a plain object for JSON serialization
    const availabilityObject: Record<number, boolean> = {}
    availability.forEach((value, key) => {
      availabilityObject[key] = value
    })

    return NextResponse.json(availabilityObject)
  } catch (error) {
    console.error('Availability fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
