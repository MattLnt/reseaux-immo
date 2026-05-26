export default function BienDetailInfo({ bien }) {
  const stats = [
    { 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, 
      label: "Chambres", 
      value: bien.nbrChambres 
    },
    ...(bien.nbrSdb ? [{
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M12 2v5M12 22v-5"/></svg>,
      label: "Salles de bain",
      value: bien.nbrSdb
    }] : []),
    { 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
      label: "Surface",
      value: `${bien.m2Habitable} m²`
    },
    ...(bien.m2Terrain ? [{
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
      label: "Terrain",
      value: `${bien.m2Terrain} m²`
    }] : [])
  ];

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 28 }}>
      {/* Titre */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#002B54', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {bien.localisation}
        </h1>
        <p style={{ fontSize: 15, color: '#5A6B7D', margin: 0 }}>
          {bien.typeBien} · {bien.etatBien}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E8EDF2' }}>
        {stats.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: '#FF9500' }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#002B54' }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Prix */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: '#002B54', borderRadius: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Prix de vente</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FF9500' }}>
            {bien.prix.toLocaleString('fr-BE')} €
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Commission</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#85A8F9' }}>
            {bien.tauxCommission}% · {((bien.prix * bien.tauxCommission) / 100).toLocaleString('fr-BE')} €
          </div>
        </div>
      </div>
    </div>
  );
}