export default function BienDetailSpecs({ bien }) {
  const specs = [
    ...(bien.peb ? [{ label: "Performance énergétique (PEB)", value: bien.peb.replace('_', '+') }] : []),
    ...(bien.revenuCadastral ? [{ label: "Revenu cadastral", value: `${bien.revenuCadastral.toLocaleString('fr-BE')} €` }] : []),
    ...(bien.rendementLocatif ? [{ label: "Rendement locatif estimé", value: `${bien.rendementLocatif}%` }] : []),
  ];

  if (specs.length === 0) return null;

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#002B54', margin: '0 0 20px' }}>Détails du bien</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {specs.map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F0F3F7' }}>
            <span style={{ fontSize: 14, color: '#5A6B7D' }}>{item.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#002B54' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}