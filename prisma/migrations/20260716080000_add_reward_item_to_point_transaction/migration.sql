-- AlterTable
ALTER TABLE "PointTransaction" ADD COLUMN "rewardItemId" TEXT;

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_rewardItemId_fkey" FOREIGN KEY ("rewardItemId") REFERENCES "RewardItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
