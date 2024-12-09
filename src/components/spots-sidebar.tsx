import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,

  SidebarSeparator,
} from '@/components/ui/sidebar';

import type { LibrarySpot, StudySpot } from '@prisma/client';
import {  getLibrarySpots } from '@/lib/db';
import React from 'react';
import { LibrarySpots } from './library-spot';

interface AppSidebarProps {
  initialLibrarySpots: LibrarySpot[];
  initialOtherSpots: StudySpot[];
  selectedBuilding: string | null;
  onBuildingSelect: (building: string | null) => void;
}

export async function AppSidebar() {
  console.log("i am being rendered on the server!")
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarHeader className="border-b border-sidebar-border">
          <h1 className="text-3xl font-bold tracking-tight"><span className="text-4xl">C</span>honker <span className="text-4xl">C</span>entral</h1>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Study spots</SidebarGroupLabel>
          <LibrarySpots />
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
    </Sidebar>
  );
}