import Link from 'next/link';

export default function StatutTabs({ currentStatut, counts = {}, baseUrl }) {
  const tabs = [
    {
      statut: 'ACTIF',
      label: 'En vente',
      count: counts.ACTIF || 0,
      color: '#10B981',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    },
    {
      statut: 'SOUS_OPTION',
      label: 'Sous option',
      count: counts.SOUS_OPTION || 0,
      color: '#F59E0B',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
    },
    {
      statut: 'VENDU',
      label: 'Vendus',
      count: counts.VENDU || 0,
      color: '#9CA3AF',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
    },
    {
      statut: 'ARCHIVE',
      label: 'Archivés',
      count: counts.ARCHIVE || 0,
      color: '#5A6B7D',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
    }
  ];

  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#FFFFFF', padding: 6, borderRadius: 12, border: '1px solid #E8EDF2', flexWrap: 'wrap' }}>
      <style>{`
        @media (max-width: 768px) {
          .statut-tab-label { display: none !important; }
          .statut-tab { padding: 8px 10px !important; }
        }
      `}</style>
      {tabs.map((tab) => {
        const isActive = currentStatut === tab.statut;
        return (
          <Link
            key={tab.statut}
            href={`${baseUrl}?statut=${tab.statut}`}
            className="statut-tab"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              background: isActive ? '#FF9500' : 'transparent',
              color: isActive ? '#FFFFFF' : '#5A6B7D',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            <span className="statut-tab-label">{tab.label}</span>
            <span style={{
              background: isActive ? 'rgba(255,255,255,0.25)' : '#F0F3F7',
              color: isActive ? '#FFFFFF' : '#5A6B7D',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              minWidth: 18,
              textAlign: 'center'
            }}>
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}