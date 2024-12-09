import { StudySpot } from '@prisma/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface StudySpotCardProps {
  spot: StudySpot;
}

export function StudySpotCard({ spot }: StudySpotCardProps) {
  return (
    <Card className="overflow-hidden">
      {spot.image && (
        <div className="flex justify-center h-48 w-full pt-4">
          <img
            src={spot.image}
            alt={`${spot.building} study space`}
            className="object-cover"
            width={150}
            height={150}
          />
        </div>
      )}
      <CardContent className="p-3">
        <h4 className="font-bold">{spot.building}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{spot.location}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="h-6 px-2">
            <Users className="mr-1 h-3 w-3" />
            {spot.capacity}
          </Badge>
          {spot.amenities.split(', ').map((amenity) => (
            <Badge key={amenity} variant="secondary" className="h-6">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}