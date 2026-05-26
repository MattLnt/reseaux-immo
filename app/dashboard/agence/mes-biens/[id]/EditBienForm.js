"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_BIEN_OPTIONS = ["APPARTEMENT", "MAISON", "VILLA", "BUREAU", "IMMEUBLE", "AUTRE"];
const ETAT_BIEN_OPTIONS = ["OCCASION", "NEUF", "PROJET", "AUTRE"];
const PEB_OPTIONS = ["A_PLUS", "A", "B", "C", "D", "E", "F", "G"];

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o === value);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: "var(--radius-md)", border: `1.5px solid ${open ? "var(--color-primary)" : "var(--border-light)"}`, background: "var(--color-gray-50)", fontSize: 14, color: selected ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", outline: "none", transition: "var(--transition-base)", textAlign: "left" }}>
        <span>{selected || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "var(--transition-base)", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-lg)", overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
            {options.map(o => (
              <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: value === o ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: value === o ? 600 : 400, background: value === o ? "var(--color-gray-100)" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid var(--color-gray-100)" }}>
                <span>{o}</span>
                {value === o && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.typeBien || !form.etatBien) { setError("Type et état du bien sont requis"); return; }
    setLoading(true); setError("");
    
    const res = await fetch(`/api/bien/${bien.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        prix: parseFloat(form.prix),
        tauxCommission: parseFloat(form.tauxCommission),
        nbrChambres: parseInt(form.nbrChambres),
        nbrSdb: form.nbrSdb ? parseInt(form.nbrSdb) : null,
        m2Habitable: parseFloat(form.m2Habitable),
        m2Terrain: form.m2Terrain ? parseFloat(form.m2Terrain) : null,
        revenuCadastral: form.revenuCadastral ? parseFloat(form.revenuCadastral) : null,
        rendementLocatif: form.rendementLocatif ? parseFloat(form.rendementLocatif) : null,
        photos: photos
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Une erreur est survenue');
      return;
    }

    router.push('/dashboard/agence/mes-biens?statut=ACTIF');
  }

  async function handleToggleStatut() {
    const newStatut = bien.statut === 'ACTIF' ? 'ARCHIVE' : 'ACTIF';
    setLoading(true);
    setError("");
    
    const res = await fetch(`/api/bien/${bien.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
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
        statut: newStatut 
      })
    });

    setLoading(false);
    
    if (res.ok) {
      router.push(`/dashboard/agence/mes-biens?statut=${newStatut}`);
      router.refresh();
    } else {
      setError("Erreur lors du changement de statut");
    }
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

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-light)", fontSize: 14, boxSizing: "border-box", outline: "none", background: "var(--color-gray-50)", color: "var(--text-primary)", transition: "var(--transition-base)" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 };
  const sectionStyle = { background: "var(--bg-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", padding: "20px", marginBottom: 12 };

  const sectionHeader = (icon, title, subtitle) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--color-gray-100)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", flexShrink: 0 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  );

  const isFormValid = form.localisation && form.prix && form.tauxCommission && form.typeBien && form.etatBien && form.nbrChambres && form.m2Habitable;

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 1024px) {
          .edit-grid { grid-template-columns: 1fr !important; }
          .edit-sidebar { display: none !important; }
          .edit-submit-mobile { display: flex !important; }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Modifier le bien</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{bien.localisation}</p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
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
                onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
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
                      onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "var(--color-accent)" }}>€</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Commission *</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" name="tauxCommission" value={form.tauxCommission} onChange={handleChange} required min="0" max="100" step="0.1"
                      placeholder="3.5"
                      style={{ ...inputStyle, paddingRight: 36 }}
                      onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "var(--color-accent)" }}>%</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--color-gray-900)", borderRadius: "var(--radius-lg)", padding: "16px 18px" }}>
                <label style={{ ...labelStyle, color: "var(--text-muted)", marginBottom: 6 }}>Commission totale estimée</label>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-accent)" }}>
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
                      onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
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
                    onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
                </div>
                <div>
                  <label style={labelStyle}>Rendement locatif (%)</label>
                  <input type="number" name="rendementLocatif" value={form.rendementLocatif} onChange={handleChange} min="0" max="100" step="0.1"
                    placeholder="4.5"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
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
                  <div key={idx} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                    <img src={url} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => removePhoto(idx)}
                      style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1.5px dashed var(--border-light)", background: "var(--color-gray-50)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
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
                onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
              
              <div style={{ marginTop: 12 }}>
                <label style={labelStyle}>Lien vers l'annonce complète</label>
                <input type="url" name="lienAnnonce" value={form.lienAnnonce} onChange={handleChange}
                  placeholder="https://..."
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--border-light)"} />
              </div>
            </div>

            {/* Bouton mobile */}
            <button type="submit" disabled={loading || !isFormValid} className="edit-submit-mobile"
              style={{ display: "none", width: "100%", padding: "14px", borderRadius: "var(--radius-md)", background: !isFormValid || loading ? "var(--color-gray-200)" : "var(--color-primary)", color: !isFormValid || loading ? "var(--text-muted)" : "var(--text-white)", fontWeight: 700, fontSize: 14, border: "none", cursor: !isFormValid || loading ? "not-allowed" : "pointer", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>

          {/* Colonne droite sticky — Actions */}
          <div className="edit-sidebar" style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>
            
            <button type="submit" disabled={loading || !isFormValid}
              style={{ width: "100%", padding: "13px", borderRadius: "var(--radius-md)", background: !isFormValid || loading ? "var(--color-gray-200)" : "var(--color-primary)", color: !isFormValid || loading ? "var(--text-muted)" : "var(--text-white)", fontWeight: 700, fontSize: 14, border: "none", cursor: !isFormValid || loading ? "not-allowed" : "pointer", transition: "var(--transition-base)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isFormValid && !loading ? "var(--shadow-md)" : "none" }}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button type="button" onClick={handleToggleStatut} disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1.5px solid var(--border-light)", color: "var(--text-primary)", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", transition: "var(--transition-base)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              {bien.statut === 'ACTIF' ? 'Archiver' : 'Réactiver'}
            </button>

            <button type="button" onClick={handleDelete} disabled={deleting}
              style={{ width: "100%", padding: "13px", borderRadius: "var(--radius-md)", background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#DC2626", fontWeight: 600, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer", transition: "var(--transition-base)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              {deleting ? 'Suppression...' : 'Supprimer'}
            </button>

            <div style={{ background: "var(--color-gray-100)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", padding: "14px", marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  Statut actuel : <strong>{bien.statut === 'ACTIF' ? 'En ligne' : 'Archivé'}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}