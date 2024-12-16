'use client'

import { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { ChevronRight, Search } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import LibrarySpotCard from './library-spot-card'
import { StudySpotCard } from './study-spot-card'
import { cn } from '@/lib/utils'
import type { LibrarySpot, StudySpot } from '@prisma/client'

interface SpotsSidebarProps {
  initialLibrarySpots: LibrarySpot[]
  initialOtherSpots: StudySpot[]
  selectedBuilding: string | null
  onBuildingSelect: (building: string | null) => void
}

export function SpotsSidebar({
  initialLibrarySpots,
  initialOtherSpots,
  selectedBuilding,
  onBuildingSelect,
}: SpotsSidebarProps) {
  const [librarySpots, setLibrarySpots] =
    useState<LibrarySpot[]>(initialLibrarySpots)
  const [otherSpots, setOtherSpots] = useState<StudySpot[]>(initialOtherSpots)
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())
  const [showAllLibrarySpots, setShowAllLibrarySpots] = useState(false)
  const [showAllOtherSpots, setShowAllOtherSpots] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildingIsLibrary = selectedBuilding === 'MacOdrum Library'

  const INITIAL_SPOTS_TO_SHOW = 5

  useEffect(() => {
    async function updateAvailability() {
      if (!buildingIsLibrary) {
        setLibrarySpots(initialLibrarySpots)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/library-spots?date=${selectedTime.toISOString()}`
        )
        if (!response.ok) throw new Error('Failed to fetch availability')

        const updatedSpots = await response.json()
        setLibrarySpots(updatedSpots)
        setError(null)
      } catch (err) {
        console.error('Availability error:', err)
        setError('Failed to fetch availability')
      } finally {
        setIsLoading(false)
      }
    }
    updateAvailability()
  }, [selectedTime, buildingIsLibrary, initialLibrarySpots])

  const filteredLibrarySpots = librarySpots.filter(
    (spot) =>
      (selectedBuilding === null || selectedBuilding === 'MacOdrum Library') &&
      spot.room.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showOnlyAvailable || spot.isAvailable)
  )

  const filteredOtherSpots = otherSpots.filter(
    (spot) =>
      (selectedBuilding === null || spot.building === selectedBuilding) &&
      (spot.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Get visible spots based on show all state
  const visibleLibrarySpots = showAllLibrarySpots
    ? filteredLibrarySpots
    : filteredLibrarySpots.slice(0, INITIAL_SPOTS_TO_SHOW)

  const visibleOtherSpots = showAllOtherSpots
    ? filteredOtherSpots
    : filteredOtherSpots.slice(0, INITIAL_SPOTS_TO_SHOW)

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">CU Study Spots</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find your perfect study space
          </p>
        </div>

        <SidebarSeparator />

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {(selectedBuilding === null ||
          selectedBuilding === 'MacOdrum Library') && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="flex items-center px-4 py-2 text-sm font-medium"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  MacOdrum Library Spots
                  <Badge variant="secondary" className="ml-auto">
                    {filteredLibrarySpots.length}
                  </Badge>
                  <ChevronRight className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className={cn('space-y-4 px-4 py-3')}>
                <SidebarGroupContent>
                  {buildingIsLibrary && (
                    <>
                      {/* <TimeSelector 
                        value={selectedTime}
                        onChange={setSelectedTime}
                      /> */}
                      <div className="flex items-center space-x-2 py-2">
                        <Switch
                          id="available-only"
                          checked={showOnlyAvailable}
                          onCheckedChange={setShowOnlyAvailable}
                        />
                        <label
                          htmlFor="available-only"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show only available rooms
                        </label>
                      </div>
                    </>
                  )}
                  <SidebarMenu className="space-y-1 pt-2">
                    {visibleLibrarySpots.map((spot) => (
                      <SidebarMenuItem key={spot.id}>
                        <LibrarySpotCard spot={spot} />
                      </SidebarMenuItem>
                    ))}

                    {filteredLibrarySpots.length > INITIAL_SPOTS_TO_SHOW && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() =>
                          setShowAllLibrarySpots(!showAllLibrarySpots)
                        }
                      >
                        {showAllLibrarySpots
                          ? `Show Less (${INITIAL_SPOTS_TO_SHOW} of ${filteredLibrarySpots.length})`
                          : `Show All (${filteredLibrarySpots.length})`}
                      </Button>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        <SidebarSeparator />

        {(selectedBuilding === null ||
          selectedBuilding !== 'MacOdrum Library') && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="flex items-center px-4 py-2 text-sm font-medium"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Other Study Spots
                  <Badge variant="secondary" className="ml-auto">
                    {filteredOtherSpots.length}
                  </Badge>
                  <ChevronRight className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className={cn('space-y-4 px-4 py-3')}>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {visibleOtherSpots.map((spot) => (
                      <SidebarMenuItem key={spot.id}>
                        <StudySpotCard spot={spot} />
                      </SidebarMenuItem>
                    ))}

                    {filteredOtherSpots.length > INITIAL_SPOTS_TO_SHOW && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setShowAllOtherSpots(!showAllOtherSpots)}
                      >
                        {showAllOtherSpots
                          ? `Show Less (${INITIAL_SPOTS_TO_SHOW} of ${filteredOtherSpots.length})`
                          : `Show All (${filteredOtherSpots.length})`}
                      </Button>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
