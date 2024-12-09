'use client';

import { useState } from 'react';
import Map from '@/components/Map';

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-background text-foreground">
      <div className="container mx-auto w-full h-full">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Carleton Study Spots</h1>
          {selectedBuilding && (
            <div className="text-lg">
              Selected: {selectedBuilding}
            </div>
          )}
        </header>
        <div className="bg-card rounded-lg shadow-md overflow-hidden h-full w-full">
          <Map onBuildingSelect={setSelectedBuilding} />
        </div>
      </div>
    </main>
  );
}