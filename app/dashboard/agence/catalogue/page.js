import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BannerStats from "@/components/ui/BannerStats";
import BienGrid from "@/components/biens/BienGrid";
import FiltresCatalogue from "./FiltresCatalogue";

export default async function CataloguePage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // Construction des filtres
  const where = {
    agenceId: { not: session.user.agenceId },
    statut: 'ACTIF',
  };

  if (params.prixMin || params.prixMax) {
    where.prix = {};
    if (params.prixMin) where.prix.gte = parseFloat(params.prixMin);
    if (params.prixMax) where.prix.lte = parseFloat(params.prixMax);
  }

  if (params.typeBien) {
    where.typeBien = params.typeBien;
  }

  if (params.nbrChambresMin) {
    where.nbrChambres = { gte: parseInt(params.nbrChambresMin) };
  }

  if (params.m2Min || params.m2Max) {
    where.m2Habitable = {};
    if (params.m2Min) where.m2Habitable.gte = parseFloat(params.m2Min);
    if (params.m2Max) where.m2Habitable.lte = parseFloat(params.m2Max);
  }

  if (params.peb) {
    where.peb = params.peb === 'A+' ? 'A_PLUS' : params.peb;
  }

  if (params.localisation) {
    where.localisation = { contains: params.localisation, mode: 'insensitive' };
  }

  const biens = await prisma.bien.findMany({
    where,
    include: {
      agence: {
        select: {
          nom: true,
          adresse: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const hasFilters = Object.keys(params).length > 0;

  // Calculs pour les stats
  const stats = {
    total: biens.length,
    actifs: biens.filter(b => b.statut === 'ACTIF').length,
    agences: new Set(biens.map(b => b.agenceId)).size,
    commissionMoyenne: biens.length > 0 
      ? (biens.reduce((sum, b) => sum + b.tauxCommission, 0) / biens.length).toFixed(1)
      : 0
  };

  return (
    <div style={{ maxWidth: "100%", margin: "-36px -40px" }}>
      <style>{`
        @media (max-width: 1024px) {
          .catalogue-layout { grid-template-columns: 1fr !important; }
          .catalogue-sidebar { display: none !important; }
        }
      `}</style>

      <div style={{ padding: "32px 40px 0" }}>
        <BannerStats title="Catalogue Réseau" stats={stats} />
      </div>

      <div style={{ padding: "0 40px 40px" }}>
        <div className="catalogue-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
          
          {/* SIDEBAR FILTRES */}
          <div className="catalogue-sidebar">
            <FiltresCatalogue />
          </div>

          {/* GRILLE DES BIENS */}
          <BienGrid biens={biens} hasFilters={hasFilters} />
        </div>
      </div>
    </div>
  );
}