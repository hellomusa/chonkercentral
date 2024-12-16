import { StudySpot } from '@prisma/client'
import useSWR, { Fetcher } from 'swr'

const apiUrl = '/api/other-study-spots'

const fetcher: Fetcher<StudySpot[], string> = (url: string) =>
  fetch(url).then((res) => res.json())

export function useOtherSpots() {
  const { data, error } = useSWR(apiUrl, fetcher)
  return {
    spots: data,
    isLoading: !data,
    error,
  }
}
