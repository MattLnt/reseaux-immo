import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BannerStats from "@/components/ui/BannerStats";
import AcheteurCard from "@/components/biens/AcheteurCard";
import FiltresAcheteurs from "./FiltresAcheteurs";

export default async function CatalogueAcheteursPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // Construction de la requête Prisma
  const where = {
    agenceId: { not: session.user.agenceId },
    statut: "ACTIF",
  };

  if (params.budgetMin || params.budgetMax) {
    if (params.budgetMin) where.budgetMax = { gte: parseFloat(params.budgetMin) };
    if (params.budgetMax) where.budgetMin = { lte: parseFloat(params.budgetMax) };
  }

  if (params.typeBien) {
    where.typesBien = { has: params.typeBien };
  }

  if (params.profilMenage) {
    where.profilMenage = params.profilMenage;
  }

  if (params.zones) {
    where.zones = { hasSome: params.zones.split(",").map(z => z.trim()).filter(Boolean) };
  }

  if (params.nbrChambresMin) {
    where.nbrChambresMin = { gte: parseInt(params.nbrChambresMin) };
  }

  const acheteurs = await prisma.acheteur.findMany({
    where,
    include: {
      agence: {
        select: {
          id: true,
          nom: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Stats pour le hero (calculées sur TOUS les acheteurs des autres agences, pas filtrés)
  const tousAcheteurs = await prisma.acheteur.findMany({
    where: { agenceId: { not: session.user.agenceId }, statut: "ACTIF" },
    select: { agenceId: true, budgetMin: true, budgetMax: true },
  });

  const budgetMoyenNum = tousAcheteurs.length > 0
    ? Math.round(
        tousAcheteurs.reduce((sum, a) => sum + (a.budgetMin + a.budgetMax) / 2, 0) / tousAcheteurs.length
      )
    : 0;

  const formatBudget = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M €`;
    if (val >= 1000) return `${Math.round(val / 1000)}k €`;
    return `${val} €`;
  };

  const stats = {
    total: tousAcheteurs.length,
    actifs: tousAcheteurs.length,
    agences: new Set(tousAcheteurs.map(a => a.agenceId)).size,
    budgetMoyen: budgetMoyenNum > 0 ? formatBudget(budgetMoyenNum) : "—",
  };

  const hasFilters = Object.keys(params).length > 0;

  return (
    <div style={{ maxWidth: "100%", margin: "-36px -40px" }}>
      <style>{`
        @media (max-width: 1024px) {
          .catalogue-acheteurs-layout { grid-template-columns: 1fr !important; }
          .catalogue-acheteurs-sidebar { position: static !important; }
          .acheteurs-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1025px) and (max-width: 1280px) {
          .acheteurs-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ padding: "32px 40px 0" }}>
        <BannerStats title="Catalogue Acheteurs" stats={stats} variant="acheteurs" />
      </div>

      <div style={{ padding: "0 40px 40px" }}>
        <div className="catalogue-acheteurs-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

          {/* SIDEBAR FILTRES */}
          <div className="catalogue-acheteurs-sidebar">
            <FiltresAcheteurs />
          </div>

          {/* GRILLE DES ACHETEURS */}
          <div>
            {/* Compteur */}
            <p style={{ fontSize: 14, color: "#5A6B7D", margin: "0 0 16px" }}>
              {acheteurs.length} acheteur{acheteurs.length > 1 ? "s" : ""} {hasFilters ? "correspondant à vos filtres" : "dans le réseau"}
            </p>

            {acheteurs.length === 0 ? (
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: "60px 24px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,149,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#FF9500" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#002B54", margin: "0 0 8px" }}>
                  {hasFilters ? "Aucun acheteur ne correspond" : "Aucun acheteur dans le réseau"}
                </h2>
                <p style={{ fontSize: 14, color: "#5A6B7D", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                  {hasFilters
                    ? "Essayez d'élargir vos filtres pour voir plus d'acheteurs."
                    : "Aucune autre agence n'a encore encodé d'acheteur sur la plateforme."}
                </p>
                {hasFilters && (
                  <Link href="/dashboard/agence/catalogue-acheteurs"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 20px", background: "#FF9500", color: "#FFFFFF", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                    Réinitialiser les filtres
                  </Link>
                )}
              </div>
            ) : (
              <div className="acheteurs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {acheteurs.map(acheteur => (
                  <AcheteurCard key={acheteur.id} acheteur={acheteur} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}