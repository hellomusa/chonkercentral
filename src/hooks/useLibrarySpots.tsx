import { LibrarySpot } from '@prisma/client'
import useSWR, { Fetcher } from 'swr'

const apiUrl = '/api/library-study-spots?date='

const fetcher: Fetcher<LibrarySpot[], string> = (url: string) =>
  fetch(url).then((res) => res.json())

export function useLibrarySpots(dateTime: string) {
  const { data, error } = useSWR(apiUrl + dateTime, fetcher)
  return {
    librarySpots: data,
    isLoading: !data,
    error,
  }
}
