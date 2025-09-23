-- AlterTable
ALTER TABLE "Thought" ADD COLUMN "font" TEXT;
ALTER TABLE "Thought" ADD COLUMN "language" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN "defaultFont" TEXT;
ALTER TABLE "UserSettings" ADD COLUMN "defaultLanguage" TEXT;
