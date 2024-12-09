import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Read JSON files
  const libraryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/library-spots.json'), 'utf-8')
  );
  const studyData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/study-spots.json'), 'utf-8')
  );

  // Clear existing data
  await prisma.librarySpot.deleteMany();
  await prisma.studySpot.deleteMany();

  // Seed library spots
  for (const spot of libraryData.librarySpots) {
    await prisma.librarySpot.create({
      data: {
        ...spot,
        lat: 45.381894,
        lng: -75.699740,
        lastChecked: new Date(),
      },
    });
  }

  // Seed study spots
  for (const spot of studyData.studySpots) {
    await prisma.studySpot.create({
      data: spot,
    });
  }

    // Get unique buildings from study spots
    const uniqueBuildings = new Map<string, { lat: number; lng: number }>()

    // Add study spots buildings
   for (const spot of studyData.studySpots) {
      if (!uniqueBuildings.has(spot.building)) {
        uniqueBuildings.set(spot.building, {
          lat: spot.lat,
          lng: spot.lng,
        })
      }
    }
  
    // Add MacOdrum Library
    uniqueBuildings.set('MacOdrum Library', {
      lat: 45.381894,
      lng: -75.699740,
    })
  
    // Create buildings
    for (const [name, coords] of uniqueBuildings) {
      try {
        await prisma.building.create({
          data: {
            name,
            lat: coords.lat,
            lng: coords.lng,
          },
        })
      } catch (error) {
        console.log(`Skipping building ${name} due to error:`, error)
        continue
      }
    }

  console.log('� Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });