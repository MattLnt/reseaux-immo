/*
  Warnings:

  - The values [VENDEUR,ACHETEUR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Acheteur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deblocage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Opportunite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendeur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VueOpportunite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[agenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PEB" AS ENUM ('A_PLUS', 'A', 'B', 'C', 'D', 'E', 'F', 'G');

-- CreateEnum
CREATE TYPE "TypeBien" AS ENUM ('APPARTEMENT', 'MAISON', 'VILLA', 'BUREAU', 'IMMEUBLE', 'AUTRE');

-- CreateEnum
CREATE TYPE "EtatBien" AS ENUM ('OCCASION', 'NEUF', 'PROJET', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutBien" AS ENUM ('ACTIF', 'ARCHIVE', 'SUPPRIME');

-- CreateEnum
CREATE TYPE "IndicateurContact" AS ENUM ('EN_COURS', 'SIGNE', 'PAS_INTERESSE', 'AUTRE');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'AGENCE');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Acheteur" DROP CONSTRAINT "Acheteur_userId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_deblocageId_fkey";

-- DropForeignKey
ALTER TABLE "Deblocage" DROP CONSTRAINT "Deblocage_acheteurId_fkey";

-- DropForeignKey
ALTER TABLE "Deblocage" DROP CONSTRAINT "Deblocage_opportuniteId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Opportunite" DROP CONSTRAINT "Opportunite_vendeurId_fkey";

-- DropForeignKey
ALTER TABLE "Vendeur" DROP CONSTRAINT "Vendeur_userId_fkey";

-- DropForeignKey
ALTER TABLE "VueOpportunite" DROP CONSTRAINT "VueOpportunite_opportuniteId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agenceId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'AGENCE';

-- DropTable
DROP TABLE "Acheteur";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "Deblocage";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Opportunite";

-- DropTable
DROP TABLE "Vendeur";

-- DropTable
DROP TABLE "VueOpportunite";

-- DropEnum
DROP TYPE "OpportuniteStatus";

-- DropEnum
DROP TYPE "PresenceDirigeant";

-- DropEnum
DROP TYPE "TypeDeal";

-- CreateTable
CREATE TABLE "Agence" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo" TEXT,
    "photo" TEXT,
    "horaire" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" TEXT NOT NULL,
    "agenceId" TEXT NOT NULL,
    "prix" INTEGER NOT NULL,
    "localisation" TEXT NOT NULL,
    "nbrChambres" INTEGER NOT NULL,
    "nbrSdb" INTEGER NOT NULL,
    "m2Terrain" INTEGER,
    "m2Habitable" INTEGER NOT NULL,
    "photos" TEXT[],
    "rendementLocatif" DOUBLE PRECISION,
    "peb" "PEB",
    "revenuCadastral" INTEGER,
    "descriptionCourte" TEXT,
    "tauxCommission" DOUBLE PRECISION NOT NULL,
    "typeBien" "TypeBien" NOT NULL,
    "etatBien" "EtatBien" NOT NULL,
    "lienAnnonce" TEXT,
    "statut" "StatutBien" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "bienId" TEXT NOT NULL,
    "agenceEnvoyeurId" TEXT NOT NULL,
    "agenceRecepteurId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "remarques" TEXT,
    "indicateur" "IndicateurContact" NOT NULL DEFAULT 'EN_COURS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bien_statut_idx" ON "Bien"("statut");

-- CreateIndex
CREATE INDEX "Bien_typeBien_idx" ON "Bien"("typeBien");

-- CreateIndex
CREATE INDEX "Bien_prix_idx" ON "Bien"("prix");

-- CreateIndex
CREATE INDEX "Bien_localisation_idx" ON "Bien"("localisation");

-- CreateIndex
CREATE INDEX "Contact_agenceEnvoyeurId_idx" ON "Contact"("agenceEnvoyeurId");

-- CreateIndex
CREATE INDEX "Contact_agenceRecepteurId_idx" ON "Contact"("agenceRecepteurId");

-- CreateIndex
CREATE INDEX "Contact_bienId_idx" ON "Contact"("bienId");

-- CreateIndex
CREATE UNIQUE INDEX "User_agenceId_key" ON "User"("agenceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_agenceEnvoyeurId_fkey" FOREIGN KEY ("agenceEnvoyeurId") REFERENCES "Agence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_agenceRecepteurId_fkey" FOREIGN KEY ("agenceRecepteurId") REFERENCES "Agence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
