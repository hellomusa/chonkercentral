
"use client";

import React, { use } from 'react'
import { motion } from 'framer-motion'
import {
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { getStudySpots } from '@/lib/db';
import { useOtherSpots } from '@/hooks/useOtherSpots';
import { StudySpotCard } from '@/components/study-spot-card';


export function OtherSpotMenuItems() {
  const { spots, isLoading, error } = useOtherSpots();

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
        Error loading other study spots: {error.message}
      </div>
    )
  }

  const otherSpots = spots ? spots : [];

  return (
    <SidebarMenuSub className="space-y-2">
      {isLoading ? (<LoadingSkeleton />) : (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {otherSpots.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No library spots available.
            </div>
          ) : (
            otherSpots.map((spot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 * 0.1 }}
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <StudySpotCard key={index} spot={spot} />
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </SidebarMenuSub>
  );
}
