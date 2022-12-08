-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Bracket` DROP FOREIGN KEY `Bracket_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `BracketLevel` DROP FOREIGN KEY `BracketLevel_bracketId_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_player1Id_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_player2Id_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_roundId_fkey`;

-- DropForeignKey
ALTER TABLE `Round` DROP FOREIGN KEY `Round_bracketLevelId_fkey`;

-- DropForeignKey
ALTER TABLE `Round` DROP FOREIGN KEY `Round_winnerId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Statistics` DROP FOREIGN KEY `Statistics_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Tournament` DROP FOREIGN KEY `Tournament_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `Whitelist` DROP FOREIGN KEY `Whitelist_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `_UserToWhitelist` DROP FOREIGN KEY `_UserToWhitelist_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserToWhitelist` DROP FOREIGN KEY `_UserToWhitelist_B_fkey`;

-- DropForeignKey
ALTER TABLE `_tournament_participant` DROP FOREIGN KEY `_tournament_participant_A_fkey`;

-- DropForeignKey
ALTER TABLE `_tournament_participant` DROP FOREIGN KEY `_tournament_participant_B_fkey`;

-- CreateIndex
CREATE INDEX `BracketLevel_bracketId_idx` ON `BracketLevel`(`bracketId`);

-- CreateIndex
CREATE INDEX `Match_roundId_idx` ON `Match`(`roundId`);

-- CreateIndex
CREATE INDEX `Round_bracketLevelId_idx` ON `Round`(`bracketLevelId`);

-- RedefineIndex
CREATE INDEX `Account_userId_idx` ON `Account`(`userId`);
DROP INDEX `Account_userId_fkey` ON `Account`;

-- RedefineIndex
CREATE INDEX `Match_player1Id_idx` ON `Match`(`player1Id`);
DROP INDEX `Match_player1Id_fkey` ON `Match`;

-- RedefineIndex
CREATE INDEX `Match_player2Id_idx` ON `Match`(`player2Id`);
DROP INDEX `Match_player2Id_fkey` ON `Match`;

-- RedefineIndex
CREATE INDEX `Round_winnerId_idx` ON `Round`(`winnerId`);
DROP INDEX `Round_winnerId_fkey` ON `Round`;

-- RedefineIndex
CREATE INDEX `Session_userId_idx` ON `Session`(`userId`);
DROP INDEX `Session_userId_fkey` ON `Session`;

-- RedefineIndex
CREATE INDEX `Tournament_ownerId_idx` ON `Tournament`(`ownerId`);
DROP INDEX `Tournament_ownerId_fkey` ON `Tournament`;
