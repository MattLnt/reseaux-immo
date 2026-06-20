"use client";
import { useState } from "react";

export default function ProfilForm({ initialData }) {
  const [form, setForm] = useState(initialData || {});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    const res = await fetch("/api/agence/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Une erreur est survenue");
    else setSuccess(true);
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid #E8EDF2", fontSize: 14, boxSizing: "border-box",
    outline: "none", background: "#FAFDFD", color: "#002B54", transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#5A6B7D",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
  };

  const champs = [
    { label: "Nom de l'agence", done: !!form.nom },
    { label: "Numéro IPI", done: !!form.numeroIPI },
    { label: "Téléphone", done: !!form.telephone },
    { label: "Email", done: !!form.email },
    { label: "Adresse", done: !!form.adresse },
    { label: "Contact référent", done: !!form.prenomContact && !!form.nomContact },
    { label: "Horaires", done: !!form.horaire },
    { label: "Description", done: !!form.description },
  ];
  const completes = champs.filter(c => c.done).length;
  const pourcentage = Math.round((completes / champs.length) * 100);
  const isValid = form.nom && form.adresse && form.telephone && form.email;
  const initiale = (form.nom || "A").charAt(0).toUpperCase();

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .profil-grid { grid-template-columns: 1fr !important; }
          .profil-banner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .profil-banner-progress { width: 100% !important; }
          .profil-grid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Bannière */}
      <div className="profil-banner" style={{
        background: "#001B38", borderRadius: 20, padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(135deg, #FF9500, #CC7700)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, fontWeight: 700, color: "#fff",
            boxShadow: "0 6px 20px rgba(255,149,0,0.35)",
          }}>
            {initiale}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              {form.nom || "Votre agence"}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              Agence partenaire du réseau
            </p>
          </div>
        </div>

        <div className="profil-banner-progress" style={{ position: "relative", zIndex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Profil complété</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#FF9500" }}>{pourcentage}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pourcentage}%`, background: "linear-gradient(90deg, #FF9500, #FFB84D)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "8px 0 0" }}>
            {completes}/{champs.length} champs renseignés
          </p>
        </div>
      </div>

      {success && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", color: "#15803D", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Profil mis à jour avec succès !
        </div>
      )}
      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Grille principale */}
      <div className="profil-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* Colonne gauche — formulaires */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Coordonnées agence */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0 }}>Coordonnées de l'agence</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Visibles par les agences du réseau</p>
              </div>
            </div>

            <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nom de l'agence *</label>
                <input type="text" value={form.nom || ""} onChange={e => setForm({ ...form, nom: e.target.value })} required
                  placeholder="Agence Dupont" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
              <div>
                <label style={labelStyle}>Numéro IPI</label>
                <input type="text" value={form.numeroIPI || ""} onChange={e => setForm({ ...form, numeroIPI: e.target.value })}
                  placeholder="Ex: 506.123" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
            </div>

            <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Téléphone *</label>
                <input type="text" value={form.telephone || ""} onChange={e => setForm({ ...form, telephone: e.target.value })} required
                  placeholder="+32 456 78 90 12" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} required
                  placeholder="contact@agence.be" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Adresse du bureau *</label>
              <input type="text" value={form.adresse || ""} onChange={e => setForm({ ...form, adresse: e.target.value })} required
                placeholder="Rue Exemple 1, 1000 Bruxelles" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            </div>
          </div>

          {/* Contact référent */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0 }}>Contact référent</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Personne en charge du compte agence</p>
              </div>
            </div>

            <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input type="text" value={form.prenomContact || ""} onChange={e => setForm({ ...form, prenomContact: e.target.value })}
                  placeholder="Jean" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input type="text" value={form.nomContact || ""} onChange={e => setForm({ ...form, nomContact: e.target.value })}
                  placeholder="Dupont" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
            </div>
          </div>

          {/* Présentation */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0 }}>Présentation</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Informations complémentaires (facultatif)</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Horaires</label>
              <input type="text" value={form.horaire || ""} onChange={e => setForm({ ...form, horaire: e.target.value })}
                placeholder="Lun–Ven : 9h–18h · Sam : 10h–13h" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={5} placeholder="Présentez votre agence en quelques mots..."
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            </div>
          </div>

          <button type="submit" disabled={loading || !isValid}
            style={{ padding: "15px", borderRadius: 14, background: !isValid || loading ? "#E5E7EB" : "#FF9500", color: !isValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isValid && !loading ? "0 6px 20px rgba(255,149,0,0.3)" : "none" }}>
            {loading
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Enregistrement...</>
              : <>Enregistrer les modifications <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            }
          </button>
        </div>

        {/* Colonne droite — infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

          {/* Complétude */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: 0 }}>Complétude</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {champs.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: item.done ? "#F0FDF4" : "#FAFDFD", borderRadius: 9, border: `1px solid ${item.done ? "#DCFCE7" : "#F0F3F7"}` }}>
                  <span style={{ fontSize: 12.5, color: item.done ? "#15803D" : "#5A6B7D", fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                  {item.done
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Pourquoi compléter */}
          <div style={{ background: "#001B38", borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,149,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Pourquoi compléter ?</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Vos coordonnées s'affichent sur chacun de vos biens partagés",
                "Les agences peuvent vous contacter pour un acheteur",
                "Un profil complet inspire confiance au réseau",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}