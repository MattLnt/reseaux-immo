import StatCard from './StatCard';

// Icônes réutilisables
const ICONS = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  euro: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12c0 4.4 3.5 8 7.8 8a7.7 7.7 0 005.2-2"/></svg>,
  archive: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
  wallet: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
  acheteur: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

// Configurations des cartes par variant
const VARIANTS = {
  dashboard: (stats) => [
    { title: "Biens disponibles", value: stats.total, color: "orange", icon: ICONS.home },
    { title: "Actifs", value: stats.actifs, color: "lightblue", icon: ICONS.check },
    { title: "Agences", value: stats.agences, color: "orange", icon: ICONS.users },
    { title: "Commission moy.", value: `${stats.commissionMoyenne}%`, color: "lightblue", icon: ICONS.euro },
  ],
  mesbiens: (stats) => [
    { title: "Total biens", value: stats.total, color: "orange", icon: ICONS.home },
    { title: "En ligne", value: stats.actifs, color: "lightblue", icon: ICONS.check },
    { title: "Archivés", value: stats.archives, color: "orange", icon: ICONS.archive },
    { title: "Valeur portefeuille", value: stats.valeur, color: "lightblue", icon: ICONS.wallet },
  ],
  acheteurs: (stats) => [
    { title: "Acheteurs disponibles", value: stats.total, color: "orange", icon: ICONS.acheteur },
    { title: "Actifs", value: stats.actifs, color: "lightblue", icon: ICONS.check },
    { title: "Agences", value: stats.agences, color: "orange", icon: ICONS.users },
    { title: "Budget moyen", value: stats.budgetMoyen, color: "lightblue", icon: ICONS.wallet },
  ],
};

export default function BannerStats({ title, stats, variant = "dashboard" }) {
  const cards = (VARIANTS[variant] || VARIANTS.dashboard)(stats);

  return (
    <div style={{ background: 'linear-gradient(135deg, #001B38 0%, #002B54 100%)', padding: 32, borderRadius: 20, marginBottom: 32 }}>
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Titre */}
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
        {title}
      </h1>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {cards.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}