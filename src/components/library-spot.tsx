"use client";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Library, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuSkeleton } from "@/components//ui/sidebar";
import { LibrarySpot } from "@prisma/client";
import LibraryRoomCalendarPopover from "@/components/date-time-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';


import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

type LibrarySpotContextType = {
  dateTime: string;
  setDateTime: Dispatch<SetStateAction<string>>;
}

export const LibrarySpotContext = createContext({} as LibrarySpotContextType);

export function LibrarySpots() {
  const [librarySpots, setLibrarySpots] = useState<LibrarySpot[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [dateTime, setDateTime] = useState<string>("");

  if (dateTime) console.log("froml ibrary spot ", dateTime);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/library-spots?date=${dateTime}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setLibrarySpots(data);
        setLoading(false);
      })
  }, [dateTime])

  if (!librarySpots) return <p>Something went wrong...</p>

  return (
    <LibrarySpotContext.Provider value={{ dateTime, setDateTime }}>
      <SidebarMenu>
        <Collapsible key={1} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="text-base">
                <Library className="mr-2 h-4 w-4" />
                <span>Library Rooms</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <LibrarySpotMenuItems spots={librarySpots} isLoading={isLoading}/>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </LibrarySpotContext.Provider>

  )
}

interface LibrarySpotMenuItemsProps {
  spots: LibrarySpot[];
  isLoading: boolean;
}

function LibrarySpotMenuItems({ spots, isLoading }: LibrarySpotMenuItemsProps) {
  return (
    <SidebarMenuSub className="pt-2">
      <LibraryRoomCalendarPopover />
      {isLoading ? Array.from({ length: 5 }).map((_, index) =>
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ) : spots.map((spot) => (
        <SidebarMenuSubItem key={spot.id}>
          <SidebarMenuSubButton asChild>
            <LibrarySpotCard spot={spot} />
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}

    </SidebarMenuSub>
  )
}

interface LibrarySpotCardProps {
  spot: LibrarySpot;
}

function LibrarySpotCard({ spot }: LibrarySpotCardProps) {
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