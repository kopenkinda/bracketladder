-- AlterTable
ALTER TABLE `Match` ADD COLUMN `winnerId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Match_winnerId_idx` ON `Match`(`winnerId`);
