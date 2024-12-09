import { useState } from 'react';
import { SpotsSidebar } from '@/components/sidebar';
import Map from '@/components/Map';
import type { LibrarySpot, StudySpot } from '@prisma/client';
import { SidebarInset, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './spots-sidebar';

interface ClientWrapperProps {
  initialLibrarySpots: LibrarySpot[];
  initialOtherSpots: StudySpot[];
}

export function ClientWrapper({ initialLibrarySpots, initialOtherSpots }: ClientWrapperProps) {
  return (
    <>
      {/* <SpotsSidebar
        initialLibrarySpots={initialLibrarySpots}
        initialOtherSpots={initialOtherSpots}
        selectedBuilding={selectedBuilding}
        onBuildingSelect={setSelectedBuilding}
      /> */}
      <AppSidebar />
      <SidebarInset className="px-2">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </header>
        <Map />
      </SidebarInset>
    </>
  );
}