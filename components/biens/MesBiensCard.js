import Link from 'next/link';

export default function MesBiensCard({ bien, statut }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', overflow: 'hidden', transition: 'all 0.2s ease', position: 'relative' }}>
      
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
        
        {/* Badge statut */}
        <div style={{ position: 'absolute', top: 12, right: 12, background: statut === 'ACTIF' ? '#FF9500' : '#5A6B7D', color: '#FFFFFF', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
          {statut === 'ACTIF' ? 'EN LIGNE' : 'ARCHIVÉ'}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#002B54', margin: '0 0 4px' }}>
            {bien.localisation}
          </h3>
          <p style={{ fontSize: 13, color: '#5A6B7D', margin: 0 }}>
            {bien.typeBien} · {bien.etatBien}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F0F3F7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5A6B7D' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            {bien.nbrChambres} ch.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5A6B7D' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            {bien.m2Habitable} m²
          </div>
          {bien.m2Terrain && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5A6B7D' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              {bien.m2Terrain} m²
            </div>
          )}
        </div>

        {/* Prix */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#FF9500', marginBottom: 2 }}>
            {bien.prix.toLocaleString('fr-BE')} €
          </div>
          <div style={{ fontSize: 12, color: '#5A6B7D' }}>
            Commission {bien.tauxCommission}%
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link href={`/dashboard/agence/mes-biens/${bien.id}`}
            style={{ display: 'block', textAlign: 'center', background: '#FAFDFD', color: '#002B54', padding: 10, borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease', border: '1px solid #E8EDF2' }}>
            Voir
          </Link>
          <Link href={`/dashboard/agence/mes-biens/${bien.id}/modifier`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#FF9500', color: '#FFFFFF', padding: 10, borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Modifier
          </Link>
        </div>
      </div>
    </div>
  );
}