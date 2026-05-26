import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BannerStats from "@/components/ui/BannerStats";
import BienListItem from "@/components/dashboard/BienListItem";
import StatBox from "@/components/dashboard/StatBox";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function DashboardAgencePage() {
  const session = await getServerSession(authOptions);

  const [totalBiens, biensActifs, totalAgences, biens] = await Promise.all([
    prisma.bien.count({ where: { agenceId: session.user.agenceId } }),
    prisma.bien.count({ where: { agenceId: session.user.agenceId, statut: 'ACTIF' } }),
    prisma.agence.count(),
    prisma.bien.findMany({
      where: { agenceId: session.user.agenceId },
      select: { tauxCommission: true }
    })
  ]);

  const commissionMoyenne = biens.length > 0
    ? (biens.reduce((sum, b) => sum + b.tauxCommission, 0) / biens.length).toFixed(1)
    : 0;

  const bannerStats = { total: totalBiens, actifs: biensActifs, agences: totalAgences, commissionMoyenne };

  // Tous les biens — pour les graphes (calcul côté client avec filtre temporel)
  const tousBiens = await prisma.bien.findMany({
    where: { agenceId: session.user.agenceId },
    select: { typeBien: true, prix: true, createdAt: true }
  });
  // Sérialisation des dates pour passage au composant client
  const biensCharts = tousBiens.map(b => ({
    typeBien: b.typeBien,
    prix: b.prix,
    createdAt: b.createdAt.toISOString()
  }));

  const derniersBiens = await prisma.bien.findMany({
    where: { agenceId: session.user.agenceId, statut: 'ACTIF' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const [catalogueBiens, catalogueAgences] = await Promise.all([
    prisma.bien.count({
      where: { statut: 'ACTIF', agenceId: { not: session.user.agenceId } }
    }),
    prisma.agence.count({
      where: { id: { not: session.user.agenceId }, biens: { some: { statut: 'ACTIF' } } }
    })
  ]);

  const quickActions = [
    {
      href: "/dashboard/agence/mes-biens/nouveau",
      label: "Ajouter un bien",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    },
    {
      href: "/dashboard/agence/catalogue",
      label: "Catalogue réseau",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
    },
    {
      href: "/dashboard/agence/mes-biens",
      label: "Mes biens",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
  ];

  return (
    <div style={{ maxWidth: "100%", margin: "-36px -40px" }}>
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .banner-actions { flex-direction: column !important; }
          .banner-actions a { width: 100% !important; }
        }
      `}</style>

      {/* Bannière */}
      <div style={{ padding: "32px 40px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#002B54', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Tableau de bord
          </h1>
          <p style={{ fontSize: 14, color: '#5A6B7D', margin: 0 }}>
            Bienvenue sur votre espace Réseaux Immo
          </p>
        </div>
        <BannerStats title="Votre portefeuille" stats={bannerStats} />

        {/* Actions rapides — barre compacte sous la bannière */}
        <div className="banner-actions" style={{ display: "flex", gap: 12, marginTop: -16, marginBottom: 8 }}>
          {quickActions.map((a, i) => (
            <Link key={a.href} href={a.href}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 18px",
                borderRadius: 12, textDecoration: "none", flex: 1,
                background: i === 0 ? "#FF9500" : "#FFFFFF",
                border: i === 0 ? "none" : "1px solid #E8EDF2",
                color: i === 0 ? "#FFFFFF" : "#002B54",
                fontSize: 14, fontWeight: 600,
                boxShadow: "0 1px 4px rgba(0,43,84,0.05)",
              }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: i === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,149,0,0.1)",
                color: i === 0 ? "#FFFFFF" : "#FF9500",
              }}>
                {a.icon}
              </span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 40px 40px" }}>

        {/* Graphiques */}
        <div style={{ marginBottom: 24 }}>
          <DashboardCharts biens={biensCharts} />
        </div>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

          {/* Derniers biens */}
          <DashboardSection title="Derniers biens ajoutés" href="/dashboard/agence/mes-biens">
            {derniersBiens.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#9CA3AF' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, color: '#5A6B7D', margin: '0 0 16px' }}>
                  Aucun bien pour le moment
                </p>
                <Link href="/dashboard/agence/mes-biens/nouveau"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#FF9500', color: '#FFFFFF', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Ajouter un bien
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {derniersBiens.map(bien => (
                  <BienListItem key={bien.id} bien={bien} />
                ))}
              </div>
            )}
          </DashboardSection>

          {/* Réseau */}
          <DashboardSection title="Le réseau">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <StatBox value={catalogueAgences} label="Agences partenaires" color="blue" />
              <StatBox value={catalogueBiens} label="Biens disponibles" color="orange" />
              <Link href="/dashboard/agence/catalogue"
                style={{ display: 'block', width: '100%', textAlign: 'center', padding: '12px', background: '#FF9500', color: '#FFFFFF', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginTop: 8 }}>
                Explorer le catalogue
              </Link>
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}