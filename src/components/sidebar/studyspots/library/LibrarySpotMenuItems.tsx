'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { parseAsBoolean, useQueryState } from 'nuqs'

import {
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import LibraryRoomCalendarPopover from '@/components/sidebar/studyspots/library/date-time-picker'
import { LibrarySpotCard } from '@/components/sidebar/studyspots/library/LibrarySpotCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { useLibrarySpot } from '@/contexts/LibrarySpotContext'
import { useLibrarySpots } from '@/hooks/useLibrarySpots'

export function LibrarySpotMenuItems() {
  const { dateTime } = useLibrarySpot()
  const { librarySpots, isLoading, error } = useLibrarySpots(dateTime)
  const [showAvailable, setShowAvailable] = useQueryState(
    'showAvailable',
    parseAsBoolean.withDefault(false)
  )

  const toggleAvailablityFilter = () =>
    setShowAvailable((isAvailable) => !isAvailable)

  const filteredSpots = React.useMemo(() => {
    if (!librarySpots) return []
    if (showAvailable)
      return librarySpots.filter((spot) => spot.isAvailable)
    return librarySpots
  }, [librarySpots, showAvailable])

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </div>
  )

  if (error) {
    return (
      <div className="text-red-500">
        Error loading library spots: {error.message}
      </div>
    )
  }

  return (
    <SidebarMenuSub className="space-y-2">
      <div className="bg-accent/50 p-4 rounded-lg">
        <LibraryRoomCalendarPopover />
        <div className="flex items-center justify-between mt-4">
          <Label
            htmlFor="available-rooms-filter"
            className="text-sm font-medium"
          >
            Show available only
          </Label>
          <Switch
            id="available-rooms-filter"
            checked={showAvailable}
            onCheckedChange={toggleAvailablityFilter}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredSpots.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No library spots available.
            </div>
          ) : (
            filteredSpots.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <LibrarySpotCard spot={spot} />
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </SidebarMenuSub>
  )
}
