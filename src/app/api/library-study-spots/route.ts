import { NextResponse } from 'next/server'
import { getLibrarySpots } from '@/lib/db'
import { checkAvailability } from '@/lib/libcal'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let dateParam = searchParams.get('date')

    if (!dateParam) {
      dateParam = dayjs().tz('America/New_York').format('YYYY-MM-DD hh:mm:ss')
    }

    console.log('test', dateParam)

    const librarySpots = await getLibrarySpots()

    const availability = await checkAvailability(dateParam)

    const spotsWithAvailability = librarySpots.map((spot) => ({
      ...spot,
      isAvailable: availability.get(spot.eid) ?? false,
    }))

    return NextResponse.json(spotsWithAvailability)
  } catch (error) {
    console.error('Failed to fetch library spots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch library spots' },
      { status: 500 }
    )
  }
}
