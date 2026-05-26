"use client";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const COLORS = ["#FF9500", "#002B54", "#85A8F9", "#5A7FE0", "#FFB84D", "#7A8BA3"];
const MOIS_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function ChartCard({ title, subtitle, action, children }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: "0 0 2px" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function DashboardCharts({ biens }) {
  const [periode, setPeriode] = useState(6); // 3, 6 ou 12 mois

  // Courbe — recalculée selon la période
  const parMois = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = periode - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = biens.filter(b => {
        const c = new Date(b.createdAt);
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      }).length;
      data.push({ mois: MOIS_LABELS[d.getMonth()], biens: count });
    }
    return data;
  }, [biens, periode]);

  // Donut — par type
  const parType = useMemo(() => {
    const TYPES = ["APPARTEMENT", "MAISON", "VILLA", "BUREAU", "IMMEUBLE", "AUTRE"];
    const LABELS = { APPARTEMENT: "Appartement", MAISON: "Maison", VILLA: "Villa", BUREAU: "Bureau", IMMEUBLE: "Immeuble", AUTRE: "Autre" };
    return TYPES.map(t => ({ name: LABELS[t], value: biens.filter(b => b.typeBien === t).length })).filter(d => d.value > 0);
  }, [biens]);

  // Barres — par tranche de prix
  const parPrix = useMemo(() => [
    { tranche: "< 200k €", value: biens.filter(b => b.prix < 200000).length },
    { tranche: "200–400k €", value: biens.filter(b => b.prix >= 200000 && b.prix < 400000).length },
    { tranche: "400–600k €", value: biens.filter(b => b.prix >= 400000 && b.prix < 600000).length },
    { tranche: "600k–1M €", value: biens.filter(b => b.prix >= 600000 && b.prix < 1000000).length },
    { tranche: "> 1M €", value: biens.filter(b => b.prix >= 1000000).length },
  ], [biens]);

  const hasType = parType.length > 0;
  const hasPrix = parPrix.some(d => d.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        @media (max-width: 1024px) {
          .charts-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Courbe — avec filtre temporel */}
      <ChartCard
        title="Évolution de votre portefeuille"
        subtitle="Biens ajoutés au fil du temps"
        action={
          <div style={{ display: "flex", gap: 4, background: "#FAFDFD", border: "1px solid #E8EDF2", borderRadius: 10, padding: 4 }}>
            {[{ v: 3, l: "3 mois" }, { v: 6, l: "6 mois" }, { v: 12, l: "12 mois" }].map(opt => (
              <button key={opt.v} onClick={() => setPeriode(opt.v)}
                style={{
                  padding: "6px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  background: periode === opt.v ? "#FF9500" : "transparent",
                  color: periode === opt.v ? "#FFFFFF" : "#5A6B7D",
                }}>
                {opt.l}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={parMois} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBiens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9500" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF9500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid #E8EDF2", fontSize: 13, boxShadow: "0 4px 12px rgba(0,43,84,0.08)" }}
              labelStyle={{ color: "#002B54", fontWeight: 700 }}
            />
            <Area type="monotone" dataKey="biens" name="Biens ajoutés" stroke="#FF9500" strokeWidth={2.5} fill="url(#colorBiens)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="charts-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Donut — par type */}
        <ChartCard title="Répartition par type" subtitle="Vos biens selon leur catégorie">
          {hasType ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={parType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {parType.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E8EDF2", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, justifyContent: "center" }}>
                {parType.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                    <span style={{ fontSize: 12, color: "#5A6B7D" }}>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Barres — par tranche de prix */}
        <ChartCard title="Répartition par prix" subtitle="Vos biens selon leur tranche de prix">
          {hasPrix ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={parPrix} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="tranche" tick={{ fontSize: 11, fill: "#5A6B7D" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #E8EDF2", fontSize: 13 }}
                  cursor={{ fill: "#FAFDFD" }}
                />
                <Bar dataKey="value" name="Biens" fill="#FF9500" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{ height: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-3" />
      </svg>
      <p style={{ fontSize: 13, marginTop: 12 }}>Aucune donnée à afficher</p>
    </div>
  );
}