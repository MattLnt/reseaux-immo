import Link from 'next/link';

export default function BienListItem({ bien }) {
  return (
    <Link 
      href={`/dashboard/agence/mes-biens/${bien.id}`}
      style={{ 
        display: 'flex', 
        gap: 12, 
        padding: 12, 
        background: '#FAFDFD', 
        borderRadius: 12, 
        border: '1px solid #E8EDF2', 
        textDecoration: 'none', 
        transition: 'all 0.2s ease' 
      }}
    >
      {/* Miniature */}
      <div style={{ width: 80, height: 80, borderRadius: 8, background: '#E8EDF2', flexShrink: 0, overflow: 'hidden' }}>
        {bien.photos && bien.photos.length > 0 ? (
          <img src={bien.photos[0]} alt={bien.localisation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
          </div>
        )}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#002B54', margin: '0 0 4px' }}>
          {bien.localisation}
        </h3>
        <p style={{ fontSize: 12, color: '#5A6B7D', margin: '0 0 6px' }}>
          {bien.typeBien} · {bien.nbrChambres} ch. · {bien.m2Habitable} m²
        </p>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#FF9500' }}>
          {bien.prix.toLocaleString('fr-BE')} €
        </div>
      </div>
    </Link>
  );
}