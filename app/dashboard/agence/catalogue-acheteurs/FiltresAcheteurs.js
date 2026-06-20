"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const TYPE_BIEN_OPTIONS = [
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "VILLA", label: "Villa" },
  { value: "BUREAU", label: "Bureau" },
  { value: "IMMEUBLE", label: "Immeuble" },
  { value: "AUTRE", label: "Autre" },
];

const PROFIL_OPTIONS = [
  { value: "CELIBATAIRE", label: "Célibataire" },
  { value: "COUPLE_SANS_ENFANT", label: "Couple sans enfant" },
  { value: "COUPLE_AVEC_ENFANTS", label: "Couple avec enfants" },
  { value: "FAMILLE", label: "Famille" },
  { value: "INVESTISSEUR", label: "Investisseur" },
  { value: "AUTRE", label: "Autre" },
];

export default function FiltresAcheteurs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    budgetMin: searchParams.get("budgetMin") || "",
    budgetMax: searchParams.get("budgetMax") || "",
    typeBien: searchParams.get("typeBien") || "",
    profilMenage: searchParams.get("profilMenage") || "",
    zones: searchParams.get("zones") || "",
    nbrChambresMin: searchParams.get("nbrChambresMin") || "",
  });

  function applyFilters() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/dashboard/agence/catalogue-acheteurs?${params.toString()}`);
  }

  function resetFilters() {
    setFilters({ budgetMin: "", budgetMax: "", typeBien: "", profilMenage: "", zones: "", nbrChambresMin: "" });
    router.push("/dashboard/agence/catalogue-acheteurs");
  }

  const hasActiveFilters = Object.values(filters).some(v => v);

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #E8EDF2",
    fontSize: 13,
    boxSizing: "border-box",
    outline: "none",
    background: "#FAFDFD",
    color: "#002B54",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    color: "#5A6B7D",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 6,
  };

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 20, position: "sticky", top: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #F0F3F7" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: 0 }}>Filtres</h2>
        {hasActiveFilters && (
          <button type="button" onClick={resetFilters}
            style={{ fontSize: 11, color: "#FF9500", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
            Réinitialiser
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Budget */}
        <div>
          <label style={labelStyle}>Budget (€)</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input type="number" value={filters.budgetMin}
              onChange={e => setFilters({ ...filters, budgetMin: e.target.value })}
              placeholder="Min" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            <input type="number" value={filters.budgetMax}
              onChange={e => setFilters({ ...filters, budgetMax: e.target.value })}
              placeholder="Max" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
          </div>
        </div>

        {/* Type de bien */}
        <div>
          <label style={labelStyle}>Type de bien recherché</label>
          <select value={filters.typeBien}
            onChange={e => setFilters({ ...filters, typeBien: e.target.value })}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#FF9500"}
            onBlur={e => e.target.style.borderColor = "#E8EDF2"}>
            <option value="">Tous</option>
            {TYPE_BIEN_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Profil ménage */}
        <div>
          <label style={labelStyle}>Profil</label>
          <select value={filters.profilMenage}
            onChange={e => setFilters({ ...filters, profilMenage: e.target.value })}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#FF9500"}
            onBlur={e => e.target.style.borderColor = "#E8EDF2"}>
            <option value="">Tous</option>
            {PROFIL_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Zones */}
        <div>
          <label style={labelStyle}>Zones recherchées</label>
          <input type="text" value={filters.zones}
            onChange={e => setFilters({ ...filters, zones: e.target.value })}
            placeholder="Bruxelles, Liège..." style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#FF9500"}
            onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
        </div>

        {/* Chambres min */}
        <div>
          <label style={labelStyle}>Chambres min</label>
          <input type="number" value={filters.nbrChambresMin}
            onChange={e => setFilters({ ...filters, nbrChambresMin: e.target.value })}
            placeholder="Ex: 3" style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#FF9500"}
            onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
        </div>

        {/* Bouton appliquer */}
        <button type="button" onClick={applyFilters}
          style={{
            marginTop: 4,
            padding: "11px",
            borderRadius: 10,
            background: "#FF9500",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 13,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            boxShadow: "0 2px 8px rgba(255,149,0,0.2)",
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}