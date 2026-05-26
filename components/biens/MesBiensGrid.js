import MesBiensCard from './MesBiensCard';
import Link from 'next/link';

export default function MesBiensGrid({ biens, statut }) {
  if (biens.length === 0) {
    return (
      <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,149,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#FF9500' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#002B54', margin: '0 0 8px' }}>
          Aucun bien {statut === 'ACTIF' ? 'actif' : 'archivé'}
        </h2>
        <p style={{ fontSize: 14, color: '#5A6B7D', margin: '0 0 24px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          {statut === 'ACTIF' 
            ? "Commencez par ajouter votre premier mandat exclusif"
            : "Les biens archivés apparaîtront ici"}
        </p>
        {statut === 'ACTIF' && (
          <Link href="/dashboard/agence/mes-biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FF9500', color: '#FFFFFF', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Ajouter un bien
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @media (max-width: 1024px) {
          .mes-biens-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      
      <div className="mes-biens-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {biens.map((bien) => (
          <MesBiensCard key={bien.id} bien={bien} statut={statut} />
        ))}
      </div>
    </div>
  );
}