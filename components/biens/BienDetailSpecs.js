export default function BienDetailSpecs({ bien }) {
  const specs = [
    ...(bien.peb ? [{ label: "Performance énergétique (PEB)", value: bien.peb.replace('_PLUS', '+').replace('_', '') }] : []),
    ...(bien.revenuCadastral ? [{ label: "Revenu cadastral", value: `${bien.revenuCadastral.toLocaleString('fr-BE')} €` }] : []),
    ...(bien.rendementLocatif ? [{ label: "Rendement locatif estimé", value: `${bien.rendementLocatif} %` }] : []),
    { label: "Type de bien", value: bien.typeBien },
    { label: "État du bien", value: bien.etatBien },
  ];

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#002B54", margin: "0 0 20px" }}>Détails du bien</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {specs.map((item, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderBottom: idx < specs.length - 1 ? "1px solid #F0F3F7" : "none",
            gap: 16,
          }}>
            <span style={{ fontSize: 13.5, color: "#5A6B7D" }}>{item.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#002B54", textAlign: "right" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}