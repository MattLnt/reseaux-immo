-- CreateEnum
CREATE TYPE "ProfilMenage" AS ENUM ('CELIBATAIRE', 'COUPLE_SANS_ENFANT', 'COUPLE_AVEC_ENFANTS', 'FAMILLE', 'INVESTISSEUR', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutAcheteur" AS ENUM ('ACTIF', 'INACTIF', 'TROUVE');

-- CreateTable
CREATE TABLE "Acheteur" (
    "id" TEXT NOT NULL,
    "agenceId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "budgetMin" INTEGER NOT NULL,
    "budgetMax" INTEGER NOT NULL,
    "zones" TEXT[],
    "typesBien" "TypeBien"[],
    "nbrChambresMin" INTEGER,
    "nbrSdbMin" INTEGER,
    "m2HabitableMin" INTEGER,
    "profilMenage" "ProfilMenage" NOT NULL,
    "remarques" TEXT,
    "consentementRGPD" BOOLEAN NOT NULL DEFAULT false,
    "statut" "StatutAcheteur" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acheteur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Acheteur_agenceId_idx" ON "Acheteur"("agenceId");

-- CreateIndex
CREATE INDEX "Acheteur_statut_idx" ON "Acheteur"("statut");

-- AddForeignKey
ALTER TABLE "Acheteur" ADD CONSTRAINT "Acheteur_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "Agence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
