"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_BIEN_OPTIONS = ["APPARTEMENT", "MAISON", "VILLA", "BUREAU", "IMMEUBLE", "AUTRE"];
const ETAT_BIEN_OPTIONS = ["OCCASION", "NEUF", "PROJET", "AUTRE"];
const PEB_OPTIONS = ["A_PLUS", "A", "B", "C", "D", "E", "F", "G"];

const STATUT_CONFIG = {
  ACTIF: { label: "En vente", color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)" },
  SOUS_OPTION: { label: "Sous option", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
  VENDU: { label: "Vendu", color: "#9CA3AF", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.3)" },
  ARCHIVE: { label: "Archivé", color: "#5A6B7D", bg: "rgba(90,107,125,0.08)", border: "rgba(90,107,125,0.3)" },
};

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o === value);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${open ? "#FF9500" : "#E8EDF2"}`, background: "#FAFDFD", fontSize: 14, color: selected ? "#002B54" : "#9CA3AF", cursor: "pointer", outline: "none", transition: "all 0.2s ease", textAlign: "left" }}>
        <span>{selected || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "#FFFFFF", borderRadius: 12, border: "1px solid #E8EDF2", boxShadow: "0 8px 24px rgba(0,43,84,0.1)", overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
            {options.map(o => (
              <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: value === o ? "#002B54" : "#5A6B7D", fontWeight: value === o ? 600 : 400, background: value === o ? "#FAFDFD" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F0F3F7" }}>
                <span>{o}</span>
                {value === o && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EditBienForm({ bien }) {
  const router = useRouter();
  const [form, setForm] = useState({
    localisation: bien.localisation || "",
    prix: bien.prix || "",
    tauxCommission: bien.tauxCommission || "",
    typeBien: bien.typeBien || "",
    etatBien: bien.etatBien || "",
    nbrChambres: bien.nbrChambres || "",
    nbrSdb: bien.nbrSdb || "",
    m2Habitable: bien.m2Habitable || "",
    m2Terrain: bien.m2Terrain || "",
    peb: bien.peb || "",
    revenuCadastral: bien.revenuCadastral || "",
    rendementLocatif: bien.rendementLocatif || "",
    descriptionCourte: bien.descriptionCourte || "",
    lienAnnonce: bien.lienAnnonce || "",
  });
  const [statut, setStatut] = useState(bien.statut || "ACTIF");
  const [photos, setPhotos] = useState(bien.photos || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (photos.length + files.length > 10) {
      setError("Maximum 10 photos");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/bien/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setPhotos([...photos, ...urls]);
    } catch (err) {
      console.error('Upload error:', err);
      setError("Erreur lors de l'upload des photos");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(idx) {
    setPhotos(photos.filter((_, i) => i !== idx));
  }

  function buildPayload(extraStatut) {
    return {
      ...form,
      prix: parseFloat(form.prix),
      tauxCommission: parseFloat(form.tauxCommission),
      nbrChambres: parseInt(form.nbrChambres),
      nbrSdb: form.nbrSdb ? parseInt(form.nbrSdb) : null,
      m2Habitable: parseFloat(form.m2Habitable),
      m2Terrain: form.m2Terrain ? parseFloat(form.m2Terrain) : null,
      revenuCadastral: form.revenuCadastral ? parseFloat(form.revenuCadastral) : null,
      rendementLocatif: form.rendementLocatif ? parseFloat(form.rendementLocatif) : null,
      photos: photos,
      statut: extraStatut || statut,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.typeBien || !form.etatBien) { setError("Type et état du bien sont requis"); return; }
    setLoading(true); setError("");

    const res = await fetch(`/api/bien/${bien.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload())
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Une erreur est survenue');
      return;
    }

    router.push(`/dashboard/agence/mes-biens?statut=${statut}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;

    setDeleting(true);
    const res = await fetch(`/api/bien/${bien.id}`, { method: 'DELETE' });

    if (res.ok) {
      router.push('/dashboard/agence/mes-biens?statut=ACTIF');
    } else {
      setDeleting(false);
      setError("Erreur lors de la suppression");
    }
  }

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#FAFDFD", color: "#002B54", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#5A6B7D", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 };
  const sectionStyle = { background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px", marginBottom: 16 };

  const sectionHeader = (icon, title, subtitle) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #F0F3F7" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500", flexShrink: 0 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  );

  const isFormValid = form.localisation && form.prix && form.tauxCommission && form.typeBien && form.etatBien && form.nbrChambres && form.m2Habitable;
  const currentStatutConfig = STATUT_CONFIG[statut] || STATUT_CONFIG.ACTIF;

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 1024px) {
          .edit-grid { grid-template-columns: 1fr !important; }
          .edit-sidebar { position: static !important; }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Modifier le bien</h1>
        <p style={{ fontSize: 13, color: "#5A6B7D", margin: 0 }}>{bien.localisation}</p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          <div>

            {/* Localisation */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                "Localisation", "Adresse ou ville du bien"
              )}
              <label style={labelStyle}>Localisation *</label>
              <input type="text" name="localisation" value={form.localisation} onChange={handleChange} required
                placeholder="Ex: Bruxelles, Ixelles, Avenue Louise 123"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            </div>

            {/* Prix & Commission */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                "Prix et commission", "Informations financières"
              )}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Prix de vente *</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" name="prix" value={form.prix} onChange={handleChange} required min="0"
                      placeholder="450000"
                      style={{ ...inputStyle, paddingRight: 36 }}
                      onFocus={e => e.target.style.borderColor = "#FF9500"}
                      onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#FF9500" }}>€</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Commission *</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" name="tauxCommission" value={form.tauxCommission} onChange={handleChange} required min="0" max="100" step="0.1"
                      placeholder="3.5"
                      style={{ ...inputStyle, paddingRight: 36 }}
                      onFocus={e => e.target.style.borderColor = "#FF9500"}
                      onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#FF9500" }}>%</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "#001B38", borderRadius: 12, padding: "16px 18px" }}>
                <label style={{ ...labelStyle, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>Commission totale estimée</label>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#FF9500" }}>
                  {form.prix && form.tauxCommission
                    ? `${((parseFloat(form.prix) * parseFloat(form.tauxCommission)) / 100).toLocaleString('fr-BE')} €`
                    : "— €"}
                </div>
              </div>
            </div>

            {/* Type & État */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                "Type de bien", "Catégorie et état"
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Type *</label>
                  <CustomSelect
                    value={form.typeBien}
                    onChange={val => setForm({ ...form, typeBien: val })}
                    options={TYPE_BIEN_OPTIONS}
                    placeholder="Sélectionner"
                  />
                </div>
                <div>
                  <label style={labelStyle}>État *</label>
                  <CustomSelect
                    value={form.etatBien}
                    onChange={val => setForm({ ...form, etatBien: val })}
                    options={ETAT_BIEN_OPTIONS}
                    placeholder="Sélectionner"
                  />
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
                "Caractéristiques", "Surface et aménagements"
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[
                  { name: "nbrChambres", label: "Chambres *", placeholder: "3" },
                  { name: "nbrSdb", label: "Salles de bain", placeholder: "2" },
                  { name: "m2Habitable", label: "Surface habitable (m²) *", placeholder: "120" },
                  { name: "m2Terrain", label: "Terrain (m²)", placeholder: "500" },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type="number" name={f.name} value={form[f.name]} onChange={handleChange} required={f.label.includes('*')} min="0"
                      placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF9500"}
                      onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                  </div>
                ))}
              </div>
            </div>

            {/* PEB & Revenu */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                "Énergie & Fiscalité", "Performance énergétique et revenu cadastral"
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>PEB</label>
                  <CustomSelect
                    value={form.peb}
                    onChange={val => setForm({ ...form, peb: val })}
                    options={PEB_OPTIONS}
                    placeholder="Sélectionner"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Revenu cadastral (€)</label>
                  <input type="number" name="revenuCadastral" value={form.revenuCadastral} onChange={handleChange} min="0"
                    placeholder="1200"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#FF9500"}
                    onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                </div>
                <div>
                  <label style={labelStyle}>Rendement locatif (%)</label>
                  <input type="number" name="rendementLocatif" value={form.rendementLocatif} onChange={handleChange} min="0" max="100" step="0.1"
                    placeholder="4.5"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#FF9500"}
                    onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
                "Photos", "Images du bien (maximum 10)"
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 12 }}>
                {photos.map((url, idx) => (
                  <div key={idx} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid #E8EDF2" }}>
                    <img src={url} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => removePhoto(idx)}
                      style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 10, border: "1.5px dashed #E8EDF2", background: "#FAFDFD", color: "#5A6B7D", fontSize: 13, fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {uploading ? "Upload en cours..." : "Ajouter des photos"}
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} disabled={uploading || photos.length >= 10} />
              </label>
            </div>

            {/* Description */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
                "Description", "Présentation courte du bien"
              )}
              <textarea name="descriptionCourte" value={form.descriptionCourte} onChange={handleChange} rows={4}
                placeholder="Points forts, emplacement, particularités..."
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />

              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Lien vers l'annonce complète</label>
                <input type="url" name="lienAnnonce" value={form.lienAnnonce} onChange={handleChange}
                  placeholder="https://..."
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
            </div>
          </div>

          {/* Colonne droite sticky — Actions */}
          <div className="edit-sidebar" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Bouton Enregistrer */}
            <button type="submit" disabled={loading || !isFormValid}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: !isFormValid || loading ? "#E5E7EB" : "#FF9500", color: !isFormValid || loading ? "#9CA3AF" : "#FFFFFF", fontWeight: 700, fontSize: 14, border: "none", cursor: !isFormValid || loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isFormValid && !loading ? "0 4px 14px rgba(255,149,0,0.25)" : "none" }}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  Enregistrer
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>

            {/* SÉLECTEUR DE STATUT */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E8EDF2", padding: "16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#5A6B7D", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                Statut du bien
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(STATUT_CONFIG).map(([key, config]) => {
                  const isActive = statut === key;
                  return (
                    <button key={key} type="button" onClick={() => setStatut(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1.5px solid ${isActive ? config.border : "#F0F3F7"}`,
                        background: isActive ? config.bg : "#FFFFFF",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: isActive ? config.color : "#E5E7EB", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? config.color : "#5A6B7D", flex: 1 }}>
                        {config.label}
                      </span>
                      {isActive && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: "10px 0 0", lineHeight: 1.5 }}>
                Cliquez sur "Enregistrer" pour appliquer le nouveau statut.
              </p>
            </div>

            {/* Bouton supprimer */}
            <button type="button" onClick={handleDelete} disabled={deleting}
              style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#DC2626", fontWeight: 600, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              {deleting ? 'Suppression...' : 'Supprimer le bien'}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}