import { LibrarySpot } from '@prisma/client'

export async function getLibrarySpotsAvailability(
  spots: LibrarySpot[],
  date: Date
): Promise<LibrarySpot[]> {
  const response = await fetch(`/api/availability?date=${date.toISOString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch availability')
  }

  const availabilityData = await response.json()
  console.log('spot.ts availabilityData', availabilityData)

  return spots.map((spot) => ({
    ...spot,
    isAvailable: availabilityData[spot.eid] ?? false,
  }))
}
