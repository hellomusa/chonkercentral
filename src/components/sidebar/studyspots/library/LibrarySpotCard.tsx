import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ExternalLink } from 'lucide-react'
import { LibrarySpotCardProps } from '@/types/library-spots'
import Link from 'next/link'

export const LibrarySpotCard = React.memo(({ spot }: LibrarySpotCardProps) => {
  return (
    <Link href={spot.link} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-105">
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-primary">{spot.room}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-6 px-2">
                <Users className="mr-1 h-3 w-3" />
                {spot.capacity}
              </Badge>
              <div
                className={`w-3 h-3 rounded-full ${
                  spot.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={spot.isAvailable ? 'Available' : 'In Use'}
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <ExternalLink className="mr-1 h-3 w-3" />
            Book Now
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})
