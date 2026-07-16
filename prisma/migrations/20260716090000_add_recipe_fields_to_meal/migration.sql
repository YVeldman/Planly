-- AlterTable
ALTER TABLE "Meal"
  ADD COLUMN "ingredients" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN "instructions" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN "imageUrl" TEXT,
  ADD COLUMN "sourceUrl" TEXT;
