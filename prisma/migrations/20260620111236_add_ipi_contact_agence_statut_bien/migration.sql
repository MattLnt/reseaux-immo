-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatutBien" ADD VALUE 'SOUS_OPTION';
ALTER TYPE "StatutBien" ADD VALUE 'VENDU';

-- AlterTable
ALTER TABLE "Agence" ADD COLUMN     "nomContact" TEXT,
ADD COLUMN     "numeroIPI" TEXT,
ADD COLUMN     "prenomContact" TEXT;
