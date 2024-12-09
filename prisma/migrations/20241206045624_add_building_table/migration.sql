-- CreateTable
CREATE TABLE "LibrarySpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eid" INTEGER NOT NULL,
    "room" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hasPower" BOOLEAN NOT NULL,
    "directions" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudySpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "building" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "accessible" BOOLEAN NOT NULL,
    "amenities" TEXT NOT NULL,
    "deskSize" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "comments" TEXT,
    "image" TEXT,
    "link" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");
