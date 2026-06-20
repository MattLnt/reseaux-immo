import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BannerStats from "@/components/ui/BannerStats";
import StatutTabs from "@/components/ui/StatutTabs";
import MesBiensGrid from "@/components/biens/MesBiensGrid";

export default async function MesBiensPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const statut = params?.statut || 'ACTIF';

  // Biens du statut courant (pour la grille)
  const biens = await prisma.bien.findMany({
    where: {
      agenceId: session.user.agenceId,
      statut: statut
    },
    orderBy: { createdAt: 'desc' }
  });

  // Tous les biens de l'agence (pour stats + compteurs onglets)
  const tousBiens = await prisma.bien.findMany({
    where: { agenceId: session.user.agenceId },
    select: { statut: true, prix: true }
  });

  // Compteurs par statut (passés à StatutTabs)
  const counts = tousBiens.reduce((acc, b) => {
    acc[b.statut] = (acc[b.statut] || 0) + 1;
    return acc;
  }, {});

  // Stats globales pour la bannière
  const totalAffiche = (counts.ACTIF || 0) + (counts.SOUS_OPTION || 0);
  const valeurTotale = tousBiens.reduce((sum, b) => sum + b.prix, 0);

  const formatValeur = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M €`;
    if (val >= 1000) return `${Math.round(val / 1000)}k €`;
    return `${val} €`;
  };

  const bannerStats = {
    total: tousBiens.length,
    actifs: totalAffiche,
    archives: counts.ARCHIVE || 0,
    valeur: formatValeur(valeurTotale)
  };

  // Texte du sous-titre selon le statut courant
  const labelStatut = {
    ACTIF: 'en vente',
    SOUS_OPTION: 'sous option',
    VENDU: 'vendu(s)',
    ARCHIVE: 'archivé(s)',
  }[statut] || '';

  return (
    <div style={{ maxWidth: "100%", margin: "-36px -40px" }}>
      <style>{`
        @media (max-width: 1024px) {
          .mes-biens-header { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
        }
      `}</style>

      <div style={{ padding: "32px 40px 0" }}>
        <BannerStats title="Mes Biens" stats={bannerStats} variant="mesbiens" />
      </div>

      <div style={{ padding: "0 40px 40px" }}>

        {/* Header avec bouton */}
        <div className="mes-biens-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 14, color: '#5A6B7D', margin: 0 }}>
              {biens.length} bien{biens.length > 1 ? 's' : ''} {labelStatut}
            </p>
          </div>
          <Link href="/dashboard/agence/mes-biens/nouveau"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FF9500', color: '#FFFFFF', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau bien
          </Link>
        </div>

        {/* Tabs 4 statuts */}
        <StatutTabs
          currentStatut={statut}
          counts={counts}
          baseUrl="/dashboard/agence/mes-biens"
        />

        {/* Grille des biens */}
        <MesBiensGrid biens={biens} statut={statut} />
      </div>
    </div>
  );
}