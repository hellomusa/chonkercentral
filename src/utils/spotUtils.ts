import type { LibrarySpot, StudySpot } from '@prisma/client'

export interface BuildingSpots {
  building: string
  coordinates: {
    lat: number
    lng: number
  }
  librarySpots: LibrarySpot[]
  studySpots: StudySpot[]
}

export function groupSpotsByBuilding(
  librarySpots: LibrarySpot[],
  studySpots: StudySpot[]
): BuildingSpots[] {
  const buildingsMap = new Map<string, BuildingSpots>()

  // Group library spots (assuming they're all in "MacOdrum Library")
  if (librarySpots.length > 0) {
    buildingsMap.set('MacOdrum Library', {
      building: 'MacOdrum Library',
      coordinates: {
        lat: librarySpots[0].lat,
        lng: librarySpots[0].lng,
      },
      librarySpots: librarySpots,
      studySpots: [],
    })
  }

  // Group study spots by building
  studySpots.forEach((spot) => {
    if (!buildingsMap.has(spot.building)) {
      buildingsMap.set(spot.building, {
        building: spot.building,
        coordinates: {
          lat: spot.lat,
          lng: spot.lng,
        },
        librarySpots: [],
        studySpots: [],
      })
    }
    buildingsMap.get(spot.building)!.studySpots.push(spot)
  })

  return Array.from(buildingsMap.values())
}
