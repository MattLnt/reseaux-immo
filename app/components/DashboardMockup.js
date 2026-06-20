// Composant visuel uniquement (pour la home).
// Reproduit fidèlement le vrai dashboard agence avec des données fictives.

export default function DashboardMockup() {
  const menuSections = [
    {
      section: "PRINCIPAL",
      items: [
        { label: "Tableau de bord", active: true, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
        { label: "Mes biens", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
        { label: "Mes acheteurs", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
        { label: "Catalogue", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
      ],
    },
    {
      section: "COMMUNICATION",
      items: [
        { label: "Messages", badge: 3, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
      ],
    },
    {
      section: "COMPTE",
      items: [
        { label: "Mon profil agence", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { label: "Mot de passe", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
        { label: "Supprimer le compte", danger: true, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg> },
      ],
    },
  ];

  const accessCards = [
    {
      label: "Vos biens", value: 12, color: "#002B54", iconBg: "rgba(0,43,84,0.1)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      label: "Vos acheteurs", value: 8, color: "#002B54", iconBg: "rgba(0,43,84,0.1)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      label: "Biens disponibles", sub: "sur le réseau", value: 247, color: "#FF9500", iconBg: "rgba(255,149,0,0.15)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      label: "Acheteurs disponibles", sub: "sur le réseau", value: 156, color: "#FF9500", iconBg: "rgba(255,149,0,0.15)",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a6 6 0 0112 0v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>,
    },
  ];

  // Données du chart d'évolution (fictives, allure naturelle)
  const chartData = [2, 4, 3, 5, 6, 5, 8, 10, 9, 11, 12, 12];
  const chartMax = Math.max(...chartData);
  const chartW = 880;
  const chartH = 180;
  const stepX = chartW / (chartData.length - 1);
  const points = chartData.map((v, i) => ({
    x: i * stepX,
    y: chartH - (v / chartMax) * (chartH - 20) - 10,
  }));
  // Courbe lisse style Recharts (Bézier)
  const smoothPath = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, "");
  const fillPath = `${smoothPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #E8EDF2",
      boxShadow: "0 20px 60px rgba(0,43,84,0.12)",
      background: "#EAEAEA",
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      minHeight: 620,
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
    }}>
      {/* SIDEBAR */}
      <aside style={{ background: "#001B38", display: "flex", flexDirection: "column" }}>
        {/* Logo + burger */}
        <div style={{ padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <img src="/logo-white.svg" alt="OnShare" style={{ height: 28, width: "auto", display: "block" }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>

        {/* Profil */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF9500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>A</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 10, color: "#F9FAFB", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>agence@onshare.be</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Agence</div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "hidden" }}>
          {menuSections.map((group) => (
            <div key={group.section} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", padding: "0 6px", marginBottom: 4 }}>
                {group.section}
              </div>
              {group.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", borderRadius: 6, marginBottom: 1,
                  background: item.active ? "rgba(255,149,0,0.15)" : "transparent",
                  color: item.danger ? "#F87171" : item.active ? "#FF9500" : "rgba(255,255,255,0.6)",
                  fontSize: 10, fontWeight: item.active ? 600 : 400,
                  borderLeft: item.active ? "2px solid #FF9500" : "2px solid transparent",
                }}>
                  <span style={{ color: item.danger ? "#F87171" : item.active ? "#FF9500" : "rgba(255,255,255,0.5)" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: "#FF9500", color: "#FFFFFF", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 10 }}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Déconnexion */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Déconnexion</span>
          </div>
        </div>
      </aside>

      {/* CONTENU */}
      <div style={{ padding: "20px 24px", overflow: "hidden" }}>
        {/* Titre */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#002B54", letterSpacing: "-0.01em", marginBottom: 2 }}>
            Tableau de bord
          </div>
          <div style={{ fontSize: 10, color: "#5A6B7D" }}>
            Bienvenue sur votre espace OnShare
          </div>
        </div>

        {/* Label Accès rapide */}
        <div style={{ fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          Accès rapide
        </div>

        {/* 4 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {accessCards.map((card, i) => (
            <div key={i} style={{
              background: "#FFFFFF", border: "1px solid #E8EDF2", borderRadius: 10,
              padding: 12, display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                  {card.icon}
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color, lineHeight: 1, marginBottom: 3 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#002B54" }}>
                  {card.label}
                </div>
                {card.sub && (
                  <div style={{ fontSize: 7, color: "#9CA3AF", marginTop: 1 }}>{card.sub}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 2 boutons d'action */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 14px", background: "#FF9500", color: "#FFFFFF",
            borderRadius: 8, fontSize: 10, fontWeight: 700,
            boxShadow: "0 4px 14px rgba(255,149,0,0.25)",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un bien
          </div>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 14px", background: "#FFFFFF", color: "#002B54",
            border: "1.5px solid #E8EDF2", borderRadius: 8, fontSize: 10, fontWeight: 700,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un acheteur
          </div>
        </div>

        {/* Chart Évolution du portefeuille */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E8EDF2", borderRadius: 10, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#002B54" }}>Évolution de votre portefeuille</div>
              <div style={{ fontSize: 8, color: "#9CA3AF", marginTop: 1 }}>Biens ajoutés au fil du temps</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["3 mois", "6 mois", "12 mois"].map((label, i) => (
                <div key={i} style={{
                  padding: "3px 8px", borderRadius: 12, fontSize: 8, fontWeight: 600,
                  background: i === 1 ? "#FF9500" : "#FAFDFD",
                  color: i === 1 ? "#FFFFFF" : "#5A6B7D",
                  border: i === 1 ? "none" : "1px solid #E8EDF2",
                }}>{label}</div>
              ))}
            </div>
          </div>

          {/* SVG chart */}
          <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ width: "100%", height: 180, display: "block" }}>
            <defs>
              <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9500" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Lignes horizontales (grille) */}
            {[0.25, 0.5, 0.75].map((p, i) => (
              <line key={i} x1="0" x2={chartW} y1={chartH * p} y2={chartH * p} stroke="#F0F3F7" strokeWidth="1" />
            ))}
            <path d={fillPath} fill="url(#mockGrad)" />
            <path d={smoothPath} fill="none" stroke="#FF9500" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#FF9500" strokeWidth="2" />
            ))}
          </svg>

          {/* Axe X */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, padding: "0 2px" }}>
            {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"].map((m, i) => (
              <div key={i} style={{ fontSize: 7, color: "#9CA3AF" }}>{m}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}