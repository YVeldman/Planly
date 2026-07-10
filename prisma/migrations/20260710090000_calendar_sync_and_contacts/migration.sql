-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "externalFeedId" TEXT,
ADD COLUMN     "externalUid" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'planly';

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "icsToken" TEXT;

-- Backfill existing rows with a random token before enforcing NOT NULL/UNIQUE
UPDATE "Family" SET "icsToken" = md5(random()::text || clock_timestamp()::text || "id") WHERE "icsToken" IS NULL;

ALTER TABLE "Family" ALTER COLUMN "icsToken" SET NOT NULL;

-- CreateTable
CREATE TABLE "ExternalCalendarFeed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "ExternalCalendarFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_externalFeedId_externalUid_key" ON "Event"("externalFeedId", "externalUid");

-- CreateIndex
CREATE UNIQUE INDEX "Family_icsToken_key" ON "Family"("icsToken");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_externalFeedId_fkey" FOREIGN KEY ("externalFeedId") REFERENCES "ExternalCalendarFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalCalendarFeed" ADD CONSTRAINT "ExternalCalendarFeed_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
