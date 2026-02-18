-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'DISPATCHER',
    "companyId" TEXT NOT NULL DEFAULT 'demo-company',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dot" TEXT NOT NULL,
    "mc" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "phone" TEXT,
    "cdlClass" TEXT NOT NULL DEFAULT 'Class A',
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "hosRemaining" INTEGER NOT NULL DEFAULT 660,
    "hosUsed" INTEGER NOT NULL DEFAULT 0,
    "hosLabel" TEXT NOT NULL DEFAULT '11h avail.',
    "location" TEXT,
    "lat" REAL,
    "lon" REAL,
    "csaScore" INTEGER NOT NULL DEFAULT 15,
    "yearsExp" INTEGER NOT NULL DEFAULT 5,
    "violations" INTEGER NOT NULL DEFAULT 0,
    "homeDomicile" TEXT,
    "nextReset" TEXT,
    "companyId" TEXT NOT NULL DEFAULT 'demo-company',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "loads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loadId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "dest" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNASSIGNED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "eta" TEXT,
    "rpm" REAL,
    "miles" INTEGER NOT NULL DEFAULT 0,
    "weight" TEXT,
    "commodity" TEXT,
    "customer" TEXT,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "driverId" TEXT,
    "companyId" TEXT NOT NULL DEFAULT 'demo-company',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loads_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "action" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL DEFAULT 'demo-company',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_dot_key" ON "companies"("dot");

-- CreateIndex
CREATE UNIQUE INDEX "companies_mc_key" ON "companies"("mc");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_driverId_key" ON "drivers"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "loads_loadId_key" ON "loads"("loadId");
