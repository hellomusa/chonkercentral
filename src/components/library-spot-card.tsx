"use client";

import { LibrarySpot } from '@prisma/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';

interface LibrarySpotCardProps {
  spot: LibrarySpot;
}

export default function LibrarySpotCard({ spot }: LibrarySpotCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{spot.room}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-6 px-2">
              <Users className="mr-1 h-3 w-3" />
              {spot.capacity}
            </Badge>
            <div 
              className={`w-3 h-3 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
              title={spot.isAvailable ? 'Available' : 'In Use'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}