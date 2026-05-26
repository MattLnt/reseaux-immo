export default function BienDetailInfo({ bien }) {
  const stats = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
      label: "Chambres",
      value: bien.nbrChambres
    },
    ...(bien.nbrSdb ? [{
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M12 2v5M12 22v-5"/></svg>,
      label: "Salles de bain",
      value: bien.nbrSdb
    }] : []),
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
      label: "Surface habitable",
      value: `${bien.m2Habitable} m²`
    },
    ...(bien.m2Terrain ? [{
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
      label: "Terrain",
      value: `${bien.m2Terrain} m²`
    }] : [])
  ];

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#002B54", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          {bien.localisation}
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", padding: "4px 12px", borderRadius: 20 }}>
            {bien.typeBien}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#5A6B7D", background: "#FAFDFD", border: "1px solid #E8EDF2", padding: "4px 12px", borderRadius: 20 }}>
            {bien.etatBien}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
        {stats.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#FAFDFD", borderRadius: 12, border: "1px solid #F0F3F7" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,149,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500", flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#002B54" }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}