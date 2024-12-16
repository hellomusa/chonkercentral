import { LibrarySpot } from '@prisma/client'

export interface LibrarySpotContextType {
  dateTime: string
  setDateTime: React.Dispatch<React.SetStateAction<string>>
}

export interface LibrarySpotMenuItemsProps {
  spots: LibrarySpot[]
  isLoading: boolean
}

export interface LibrarySpotCardProps {
  spot: LibrarySpot
}
