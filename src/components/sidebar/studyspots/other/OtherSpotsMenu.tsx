'use client'

import React from 'react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { Library, ChevronRight } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

import { OtherSpotMenuItems } from '@/components/sidebar/studyspots/other/OtherSpotMenuItems'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'

interface OtherSpotsMenu {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OtherSpotsMenu({
  open,
  onOpenChange,
}: OtherSpotsMenu) {
  return (
    <SidebarMenu>
      <Collapsible
        open={open}
        onOpenChange={onOpenChange}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="text-base hover:bg-accent/50 transition-colors duration-200">
              <Library className="mr-2 h-4 w-4" />
              <span>Other spots</span>
              <motion.div
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <OtherSpotMenuItems />
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
