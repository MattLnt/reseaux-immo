import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BienListItem from "@/components/dashboard/BienListItem";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function DashboardAgencePage() {
  const session = await getServerSession(authOptions);
  const myAgenceId = session.user.agenceId;

  // 4 stats clés pour les cards d'accès rapide
  const [
    mesBiensCount,
    mesAcheteursCount,
    biensReseauCount,
    acheteursReseauCount,
    derniersBiens,
    tousBiens,
  ] = await Promise.all([
    // Mes biens actifs
    prisma.bien.count({ where: { agenceId: myAgenceId, statut: 'ACTIF' } }),
    // Mes acheteurs actifs
    prisma.acheteur.count({ where: { agenceId: myAgenceId, statut: 'ACTIF' } }),
    // Biens des autres agences
    prisma.bien.count({ where: { statut: 'ACTIF', agenceId: { not: myAgenceId } } }),
    // Acheteurs des autres agences
    prisma.acheteur.count({ where: { statut: 'ACTIF', agenceId: { not: myAgenceId } } }),
    // 3 derniers biens
    prisma.bien.findMany({
      where: { agenceId: myAgenceId, statut: 'ACTIF' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    // Pour les charts
    prisma.bien.findMany({
      where: { agenceId: myAgenceId },
      select: { typeBien: true, prix: true, createdAt: true },
    }),
  ]);

  // Sérialisation pour le composant client
  const biensCharts = tousBiens.map(b => ({
    typeBien: b.typeBien,
    prix: b.prix,
    createdAt: b.createdAt.toISOString(),
  }));

  // 4 cards d'accès rapide
  const accessCards = [
    {
      href: "/dashboard/agence/mes-biens",
      label: "Vos biens",
      value: mesBiensCount,
      color: "#002B54",
      bg: "rgba(0,43,84,0.06)",
      iconBg: "rgba(0,43,84,0.1)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      href: "/dashboard/agence/mes-acheteurs",
      label: "Vos acheteurs",
      value: mesAcheteursCount,
      color: "#002B54",
      bg: "rgba(0,43,84,0.06)",
      iconBg: "rgba(0,43,84,0.1)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      href: "/dashboard/agence/catalogue",
      label: "Biens disponibles",
      sub: "sur le réseau",
      value: biensReseauCount,
      color: "#FF9500",
      bg: "rgba(255,149,0,0.08)",
      iconBg: "rgba(255,149,0,0.15)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      href: "/dashboard/agence/catalogue-acheteurs",
      label: "Acheteurs disponibles",
      sub: "sur le réseau",
      value: acheteursReseauCount,
      color: "#FF9500",
      bg: "rgba(255,149,0,0.08)",
      iconBg: "rgba(255,149,0,0.15)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a6 6 0 0112 0v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>,
    },
  ];

  return (
    <div style={{ maxWidth: 1400 }}>
      <style>{`
        @media (max-width: 1024px) {
          .access-grid { grid-template-columns: 1fr 1fr !important; }
          .actions-row { flex-direction: column !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .access-grid { grid-template-columns: 1fr !important; }
        }
        .access-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,43,84,0.08); }
      `}</style>

      {/* Titre */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#002B54', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Tableau de bord
        </h1>
        <p style={{ fontSize: 14, color: '#5A6B7D', margin: 0 }}>
          Bienvenue sur votre espace OnShare
        </p>
      </div>

      {/* Accès rapide — 4 cards cliquables */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Accès rapide
        </div>
        <div className="access-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {accessCards.map((card) => (
            <Link key={card.href} href={card.href} className="access-card"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8EDF2',
                borderRadius: 16,
                padding: 22,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'all 0.18s ease',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: card.color, lineHeight: 1, marginBottom: 4 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#002B54' }}>
                  {card.label}
                </div>
                {card.sub && (
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                    {card.sub}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2 boutons d'action principaux */}
      <div className="actions-row" style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <Link href="/dashboard/agence/mes-biens/nouveau"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '14px 20px',
            background: '#FF9500',
            color: '#FFFFFF',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(255,149,0,0.25)',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter un bien
        </Link>
        <Link href="/dashboard/agence/mes-acheteurs/nouveau"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '14px 20px',
            background: '#FFFFFF',
            color: '#002B54',
            border: '1.5px solid #E8EDF2',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter un acheteur
        </Link>
      </div>

      {/* Graphiques */}
      <div style={{ marginBottom: 28 }}>
        <DashboardCharts biens={biensCharts} />
      </div>

      {/* Derniers biens — pleine largeur */}
      <DashboardSection title="Derniers biens ajoutés" href="/dashboard/agence/mes-biens">
        {derniersBiens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#9CA3AF' }}>
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
    </div>
  );
}