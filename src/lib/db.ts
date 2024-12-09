import { PrismaClient } from '@prisma/client';
import type { Building, LibrarySpot, StudySpot } from "@prisma/client";
import { checkAvailability } from '@/lib/libcal';

const prisma = new PrismaClient();

export async function getLibrarySpots(): Promise<LibrarySpot[]> {
  return prisma.librarySpot.findMany();
}

export async function getAllStudySpots(): Promise<{
  librarySpots: LibrarySpot[];
  otherSpots: StudySpot[];
}> {
  const [librarySpots, otherSpots] = await Promise.all([
    prisma.librarySpot.findMany(),
    prisma.studySpot.findMany()
  ]);

  return {
    librarySpots,
    otherSpots
  };
}

export async function getBuildings(): Promise<Building[]> {
  return prisma.building.findMany();
}