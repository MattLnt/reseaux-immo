import Link from 'next/link';

export default function AgenceSidebar({ agence, returnUrl = '/dashboard/agence/catalogue' }) {
  return (
    <div style={{ position: 'sticky', top: 20 }}>
      <style>{`
        @media (max-width: 1024px) {
          .agence-sidebar-container { position: static !important; }
        }
      `}</style>
      
      <div className="agence-sidebar-container" style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 24 }}>
        {/* Infos agence */}
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #E8EDF2' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#002B54', margin: '0 0 4px' }}>
            {agence.nom}
          </h3>
          <p style={{ fontSize: 13, color: '#5A6B7D', margin: 0 }}>
            {agence.adresse}
          </p>
        </div>

        {/* Téléphone */}
        {agence.telephone && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Téléphone
            </div>
            <a href={`tel:${agence.telephone}`} style={{ fontSize: 14, fontWeight: 600, color: '#FF9500', textDecoration: 'none' }}>
              {agence.telephone}
            </a>
          </div>
        )}

        {/* Email */}
        {agence.email && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6B7D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Email
            </div>
            <a href={`mailto:${agence.email}`} style={{ fontSize: 14, fontWeight: 600, color: '#FF9500', textDecoration: 'none', wordBreak: 'break-word' }}>
              {agence.email}
            </a>
          </div>
        )}

        {/* Bouton contact */}
        <button type="button"
          style={{ width: '100%', padding: 14, borderRadius: 8, background: '#FF9500', color: '#FFFFFF', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Contacter l'agence
        </button>

        {/* Bouton retour */}
        <Link href={returnUrl}
          style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 12, padding: 11, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E8EDF2', color: '#002B54', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease' }}>
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  );
}