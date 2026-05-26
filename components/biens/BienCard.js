import Link from 'next/link';

export default function BienCard({ bien }) {
  return (
    <Link href={`/dashboard/agence/catalogue/${bien.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', overflow: 'hidden', transition: 'all 0.2s ease', cursor: 'pointer', height: '100%' }}>
        
        {/* Image */}
        <div style={{ height: 200, background: '#E8EDF2', position: 'relative', overflow: 'hidden' }}>
          {bien.photos && bien.photos.length > 0 ? (
            <img src={bien.photos[0]} alt={bien.localisation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
          
          {/* Badge PEB */}
          {bien.peb && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#FFFFFF', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#002B54', boxShadow: '0 2px 8px rgba(0,43,84,0.12)' }}>
              PEB {bien.peb.replace('_', '+')}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#002B54', margin: '0 0 6px', lineHeight: 1.3 }}>
              {bien.localisation}
            </h3>
            <p style={{ fontSize: 13, color: '#5A6B7D', margin: 0 }}>
              {bien.typeBien} · {bien.etatBien}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F0F3F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#5A6B7D' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              <span style={{ fontWeight: 600, color: '#002B54' }}>{bien.nbrChambres}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#5A6B7D' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              <span style={{ fontWeight: 600, color: '#002B54' }}>{bien.m2Habitable} m²</span>
            </div>
          </div>

          {/* Prix */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FF9500', marginBottom: 4 }}>
              {bien.prix.toLocaleString('fr-BE')} €
            </div>
            <div style={{ fontSize: 12, color: '#5A6B7D' }}>
              Commission {bien.tauxCommission}% · {((bien.prix * bien.tauxCommission) / 100).toLocaleString('fr-BE')} €
            </div>
          </div>

          {/* Agence */}
          <div style={{ padding: '12px 14px', background: '#FAFDFD', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #E8EDF2' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#002B54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
              {bien.agence.nom[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#002B54', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bien.agence.nom}
              </div>
              <div style={{ fontSize: 11, color: '#5A6B7D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bien.agence.adresse}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}