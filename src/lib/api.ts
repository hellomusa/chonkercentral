export async function fetchSpots(date: Date) {
  const response = await fetch(`/api/spots?date=${date.toISOString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch spots')
  }
  return response.json()
}

export async function fetchBuildings() {
  const response = await fetch('/api/buildings')
  if (!response.ok) {
    throw new Error('Failed to fetch buildings')
  }
  return response.json()
}
