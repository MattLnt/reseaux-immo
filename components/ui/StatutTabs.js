import Link from 'next/link';

export default function StatutTabs({ currentStatut, actifCount, archiveCount, baseUrl }) {
  const tabs = [
    {
      statut: 'ACTIF',
      label: 'Actifs',
      count: actifCount,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    },
    {
      statut: 'ARCHIVE',
      label: 'Archivés',
      count: archiveCount,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
    }
  ];

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 32, background: '#FFFFFF', padding: 6, borderRadius: 12, border: '1px solid #E8EDF2', width: 'fit-content' }}>
      {tabs.map((tab) => {
        const isActive = currentStatut === tab.statut;
        return (
          <Link
            key={tab.statut}
            href={`${baseUrl}?statut=${tab.statut}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: isActive ? '#FF9500' : 'transparent',
              color: isActive ? '#FFFFFF' : '#5A6B7D',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            {tab.label}
            <span style={{
              background: isActive ? 'rgba(255,255,255,0.25)' : '#F0F3F7',
              color: isActive ? '#FFFFFF' : '#5A6B7D',
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 20
            }}>
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}