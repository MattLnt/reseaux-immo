"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const TYPE_BIEN_OPTIONS = [
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "VILLA", label: "Villa" },
  { value: "BUREAU", label: "Bureau" },
  { value: "IMMEUBLE", label: "Immeuble" },
  { value: "AUTRE", label: "Autre" },
];

const PROFIL_MENAGE_OPTIONS = [
  { value: "CELIBATAIRE", label: "Célibataire" },
  { value: "COUPLE_SANS_ENFANT", label: "Couple sans enfant" },
  { value: "COUPLE_AVEC_ENFANTS", label: "Couple avec enfants" },
  { value: "FAMILLE", label: "Famille" },
  { value: "INVESTISSEUR", label: "Investisseur" },
  { value: "AUTRE", label: "Autre" },
];

export default function AcheteurForm({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    prenom: initialData?.prenom || "",
    nom: initialData?.nom || "",
    email: initialData?.email || "",
    telephone: initialData?.telephone || "",
    budgetMin: initialData?.budgetMin?.toString() || "",
    budgetMax: initialData?.budgetMax?.toString() || "",
    zones: initialData?.zones || [],
    typesBien: initialData?.typesBien || [],
    nbrChambresMin: initialData?.nbrChambresMin?.toString() || "",
    nbrSdbMin: initialData?.nbrSdbMin?.toString() || "",
    m2HabitableMin: initialData?.m2HabitableMin?.toString() || "",
    profilMenage: initialData?.profilMenage || "",
    remarques: initialData?.remarques || "",
    consentementRGPD: isEdit ? true : false,
  });

  const [zoneInput, setZoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
    language: "fr",
    region: "BE",
  });

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  function toggleType(type) {
    const types = form.typesBien.includes(type)
      ? form.typesBien.filter(t => t !== type)
      : [...form.typesBien, type];
    handleChange("typesBien", types);
  }

  function addZoneValue(value) {
    const z = value?.trim();
    if (!z) return;
    if (form.zones.includes(z)) {
      setZoneInput("");
      return;
    }
    setForm(prev => ({ ...prev, zones: [...prev.zones, z] }));
    setZoneInput("");
  }

  function addZone() {
    addZoneValue(zoneInput);
  }

  function removeZone(z) {
    handleChange("zones", form.zones.filter(zone => zone !== z));
  }

  function handleZoneKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addZone();
    }
  }

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    const value = place?.formatted_address || place?.name;
    if (value) addZoneValue(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validations front
    if (!form.consentementRGPD) {
      setError("Vous devez certifier le consentement RGPD");
      return;
    }
    if (form.zones.length === 0) {
      setError("Ajoutez au moins une zone recherchée");
      return;
    }
    if (form.typesBien.length === 0) {
      setError("Sélectionnez au moins un type de bien");
      return;
    }
    if (parseInt(form.budgetMin) > parseInt(form.budgetMax)) {
      setError("Le budget minimum ne peut pas dépasser le budget maximum");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/acheteur/${initialData.id}` : "/api/acheteur";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      router.push("/dashboard/agence/mes-acheteurs");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  // Styles communs
  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E8EDF2", fontSize: 14, background: "#FFFFFF", color: "#002B54", outline: "none", transition: "all 0.15s ease", fontFamily: "inherit" };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#002B54", marginBottom: 8, letterSpacing: "0.01em" };
  const sectionStyle = { background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 28, marginBottom: 20 };
  const sectionTitleStyle = { fontSize: 16, fontWeight: 700, color: "#002B54", margin: "0 0 6px" };
  const sectionSubStyle = { fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
      <style>{`
        .acheteur-input:focus { border-color: #FF9500 !important; }
        .acheteur-type-btn { transition: all 0.15s ease; }
        .acheteur-type-btn:hover { border-color: #FF9500 !important; }
        .zone-chip { transition: all 0.15s ease; }
        .zone-chip:hover { background: rgba(255,149,0,0.15) !important; }
        .acheteur-autocomplete-wrap { flex: 1; }
      `}</style>

      {error && (
        <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#B91C1C" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Identité ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Identité de l'acheteur</h2>
        <p style={sectionSubStyle}>Ces informations restent privées et ne sont jamais affichées aux autres agences.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input className="acheteur-input" type="text" required value={form.prenom}
              onChange={e => handleChange("prenom", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input className="acheteur-input" type="text" required value={form.nom}
              onChange={e => handleChange("nom", e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Email *</label>
            <input className="acheteur-input" type="email" required value={form.email}
              onChange={e => handleChange("email", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Téléphone *</label>
            <input className="acheteur-input" type="tel" required value={form.telephone}
              onChange={e => handleChange("telephone", e.target.value)} style={inputStyle} placeholder="+32 ..." />
          </div>
        </div>
      </div>

      {/* ── Budget ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Budget</h2>
        <p style={sectionSubStyle}>Fourchette de prix recherchée par l'acheteur.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Budget minimum (€) *</label>
            <input className="acheteur-input" type="number" required min={0} value={form.budgetMin}
              onChange={e => handleChange("budgetMin", e.target.value)} style={inputStyle} placeholder="200000" />
          </div>
          <div>
            <label style={labelStyle}>Budget maximum (€) *</label>
            <input className="acheteur-input" type="number" required min={0} value={form.budgetMax}
              onChange={e => handleChange("budgetMax", e.target.value)} style={inputStyle} placeholder="350000" />
          </div>
        </div>
      </div>

      {/* ── Zones recherchées ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Zones recherchées *</h2>
        <p style={sectionSubStyle}>Tapez et sélectionnez une ville parmi les suggestions, ou cliquez Ajouter.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (autocompleteRef.current = ac)}
              onPlaceChanged={handlePlaceChanged}
              options={{
                componentRestrictions: { country: "be" },
                types: ["(cities)"],
                language: "fr",
              }}
              className="acheteur-autocomplete-wrap"
            >
              <input className="acheteur-input" type="text" value={zoneInput}
                onChange={e => setZoneInput(e.target.value)}
                onKeyDown={handleZoneKeyDown}
                placeholder="Ex: Bruxelles, Liège, Namur..."
                style={{ ...inputStyle, flex: 1 }} />
            </Autocomplete>
          ) : (
            <input className="acheteur-input" type="text" value={zoneInput}
              onChange={e => setZoneInput(e.target.value)}
              onKeyDown={handleZoneKeyDown}
              placeholder="Chargement..."
              disabled
              style={{ ...inputStyle, flex: 1 }} />
          )}
          <button type="button" onClick={addZone}
            style={{ padding: "11px 20px", borderRadius: 10, background: "#002B54", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Ajouter
          </button>
        </div>

        {form.zones.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {form.zones.map(z => (
              <div key={z} className="zone-chip"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.3)", color: "#002B54", padding: "7px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                <span>📍 {z}</span>
                <button type="button" onClick={() => removeZone(z)}
                  style={{ background: "none", border: "none", color: "#FF9500", cursor: "pointer", fontSize: 16, fontWeight: 700, padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Types de bien ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Types de bien recherchés *</h2>
        <p style={sectionSubStyle}>Plusieurs choix possibles.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {TYPE_BIEN_OPTIONS.map(opt => {
            const active = form.typesBien.includes(opt.value);
            return (
              <button key={opt.value} type="button" className="acheteur-type-btn" onClick={() => toggleType(opt.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${active ? "#FF9500" : "#E8EDF2"}`,
                  background: active ? "rgba(255,149,0,0.06)" : "#FFFFFF",
                  color: active ? "#FF9500" : "#5A6B7D",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}>
                {active && <span>✓</span>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Critères ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Critères additionnels</h2>
        <p style={sectionSubStyle}>Tous optionnels — laissez vide si l'acheteur n'a pas de préférence.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Chambres min.</label>
            <input className="acheteur-input" type="number" min={0} value={form.nbrChambresMin}
              onChange={e => handleChange("nbrChambresMin", e.target.value)} style={inputStyle} placeholder="2" />
          </div>
          <div>
            <label style={labelStyle}>Salles de bain min.</label>
            <input className="acheteur-input" type="number" min={0} value={form.nbrSdbMin}
              onChange={e => handleChange("nbrSdbMin", e.target.value)} style={inputStyle} placeholder="1" />
          </div>
          <div>
            <label style={labelStyle}>Surface habitable min. (m²)</label>
            <input className="acheteur-input" type="number" min={0} value={form.m2HabitableMin}
              onChange={e => handleChange("m2HabitableMin", e.target.value)} style={inputStyle} placeholder="80" />
          </div>
        </div>
      </div>

      {/* ── Profil ménage ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Profil du ménage *</h2>
        <p style={sectionSubStyle}>Aide les autres agences à mieux qualifier le profil de l'acheteur.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {PROFIL_MENAGE_OPTIONS.map(opt => {
            const active = form.profilMenage === opt.value;
            return (
              <button key={opt.value} type="button" className="acheteur-type-btn" onClick={() => handleChange("profilMenage", opt.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${active ? "#FF9500" : "#E8EDF2"}`,
                  background: active ? "rgba(255,149,0,0.06)" : "#FFFFFF",
                  color: active ? "#FF9500" : "#5A6B7D",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}>
                {active && <span>✓</span>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Remarques ─────────────────────────── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Autres critères ou remarques</h2>
        <p style={sectionSubStyle}>Tout ce qui peut aider à mieux cibler. Optionnel.</p>

        <textarea className="acheteur-input" rows={4} value={form.remarques}
          onChange={e => handleChange("remarques", e.target.value)}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          placeholder="Ex: cherche avec jardin, proche écoles, garage indispensable..." />
      </div>

      {/* ── RGPD ─────────────────────────── */}
      {!isEdit && (
        <div style={{ ...sectionStyle, background: "rgba(255,149,0,0.04)", border: "1.5px solid rgba(255,149,0,0.3)" }}>
          <h2 style={sectionTitleStyle}>Consentement RGPD *</h2>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 12 }}>
            <input type="checkbox" checked={form.consentementRGPD}
              onChange={e => handleChange("consentementRGPD", e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, accentColor: "#FF9500", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#002B54", lineHeight: 1.6 }}>
              Je certifie que cet acheteur a marqué son accord pour que ses informations soient partagées avec des agences partenaires dans le cadre de sa recherche immobilière.
            </span>
          </label>
        </div>
      )}

      {/* ── Actions ─────────────────────────── */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button type="button" onClick={() => router.push("/dashboard/agence/mes-acheteurs")}
          style={{ padding: "12px 24px", borderRadius: 10, background: "#FFFFFF", border: "1px solid #E8EDF2", color: "#5A6B7D", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Annuler
        </button>
        <button type="submit" disabled={loading}
          style={{ padding: "12px 28px", borderRadius: 10, background: "#FF9500", border: "none", color: "#FFFFFF", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 14px rgba(255,149,0,0.3)" }}>
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer l'acheteur"}
        </button>
      </div>
    </form>
  );
}