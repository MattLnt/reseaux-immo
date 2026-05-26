"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import PhotoUploader from "./PhotoUploader";
import FormRecap from "./FormRecap";

const TYPE_BIEN_OPTIONS = ["APPARTEMENT", "MAISON", "VILLA", "BUREAU", "IMMEUBLE", "AUTRE"];
const ETAT_BIEN_OPTIONS = ["OCCASION", "NEUF", "PROJET", "AUTRE"];
const PEB_OPTIONS = ["A_PLUS", "A", "B", "C", "D", "E", "F", "G"];
const libraries = ["places"];

export default function BienForm({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    localisation: "",
    prix: "",
    tauxCommission: "",
    partRetrocedee: 30,
    typeBien: "",
    etatBien: "",
    nbrChambres: "",
    nbrSdb: "",
    m2Habitable: "",
    m2Terrain: "",
    peb: "",
    revenuCadastral: "",
    rendementLocatif: "",
    descriptionCourte: "",
    lienAnnonce: "",
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
    language: 'fr',
    region: 'BE'
  });

  // Pré-remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (initialData) {
      setForm({
        localisation: initialData.localisation || "",
        prix: initialData.prix?.toString() || "",
        tauxCommission: initialData.tauxCommission?.toString() || "",
        partRetrocedee: initialData.partRetrocedee ?? 30,
        typeBien: initialData.typeBien || "",
        etatBien: initialData.etatBien || "",
        nbrChambres: initialData.nbrChambres?.toString() || "",
        nbrSdb: initialData.nbrSdb?.toString() || "",
        m2Habitable: initialData.m2Habitable?.toString() || "",
        m2Terrain: initialData.m2Terrain?.toString() || "",
        peb: initialData.peb || "",
        revenuCadastral: initialData.revenuCadastral?.toString() || "",
        rendementLocatif: initialData.rendementLocatif?.toString() || "",
        descriptionCourte: initialData.descriptionCourte || "",
        lienAnnonce: initialData.lienAnnonce || "",
      });
      setPhotos(initialData.photos || []);
    }
  }, [initialData]);

  function handleChange(e) { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
  }

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      setForm({ ...form, localisation: place.formatted_address });
    }
  }

  function handleLocalisationChange(e) {
    setForm({ ...form, localisation: e.target.value });
  }

  function buildBody(extra = {}) {
    return {
      ...form,
      prix: parseFloat(form.prix),
      tauxCommission: parseFloat(form.tauxCommission),
      partRetrocedee: parseInt(form.partRetrocedee),
      nbrChambres: parseInt(form.nbrChambres),
      nbrSdb: form.nbrSdb ? parseInt(form.nbrSdb) : null,
      m2Habitable: parseFloat(form.m2Habitable),
      m2Terrain: form.m2Terrain ? parseFloat(form.m2Terrain) : null,
      revenuCadastral: form.revenuCadastral ? parseFloat(form.revenuCadastral) : null,
      rendementLocatif: form.rendementLocatif ? parseFloat(form.rendementLocatif) : null,
      photos: photos,
      ...extra
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.typeBien || !form.etatBien) { 
      setError("Type et état du bien sont requis"); 
      return; 
    }
    setLoading(true); 
    setError("");

    const url = mode === "edit" ? `/api/bien/${initialData.id}` : '/api/bien';
    const method = mode === "edit" ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody())
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
    const newStatut = initialData.statut === 'ACTIF' ? 'ARCHIVE' : 'ACTIF';
    setLoading(true);
    setError("");

    const res = await fetch(`/api/bien/${initialData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody({ statut: newStatut }))
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
    const res = await fetch(`/api/bien/${initialData.id}`, { method: 'DELETE' });

    if (res.ok) {
      router.push('/dashboard/agence/mes-biens?statut=ACTIF');
    } else {
      setDeleting(false);
      setError("Erreur lors de la suppression");
    }
  }

  const isFormValid = form.localisation && form.prix && form.tauxCommission && form.typeBien && form.etatBien && form.nbrChambres && form.m2Habitable;

  const inputStyle = { 
    width: "100%", 
    padding: "11px 14px", 
    borderRadius: 8, 
    border: "1.5px solid #E8EDF2", 
    fontSize: 14, 
    boxSizing: "border-box", 
    outline: "none", 
    background: "#FAFDFD", 
    color: "#002B54", 
    transition: "all 0.2s ease" 
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 1024px) {
          .bien-form-grid { grid-template-columns: 1fr !important; }
          .bien-form-submit-mobile { display: flex !important; }
        }
      `}</style>

      {/* Erreur */}
      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bien-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
          
          {/* COLONNE PRINCIPALE */}
          <div>

            {/* Localisation */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              title="Localisation"
              subtitle="Ville ou commune du bien"
            >
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#5A6B7D", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                Localisation *
              </label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    componentRestrictions: { country: "be" },
                    types: ["geocode"],
                    language: 'fr'
                  }}
                >
                  <input 
                    type="text" 
                    value={form.localisation} 
                    onChange={handleLocalisationChange} 
                    required
                    placeholder="Bruxelles, Liège, Anvers..."
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#FF9500"}
                    onBlur={e => e.target.style.borderColor = "#E8EDF2"} 
                  />
                </Autocomplete>
              ) : (
                <input type="text" placeholder="Chargement..." style={inputStyle} disabled />
              )}
            </FormSection>

            {/* Prix & Commission */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              title="Prix et commission"
              subtitle="Informations financières et rétrocession"
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
                <FormInput
                  label="Prix de vente"
                  name="prix"
                  type="number"
                  value={form.prix}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="450000"
                  suffix="€"
                />
                <FormInput
                  label="Commission"
                  name="tauxCommission"
                  type="number"
                  value={form.tauxCommission}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="3.5"
                  suffix="%"
                />
              </div>

              {/* Commission calculée + jauge de rétrocession */}
              {(() => {
                const commissionTotale = form.prix && form.tauxCommission
                  ? (parseFloat(form.prix) * parseFloat(form.tauxCommission)) / 100
                  : 0;
                const montantRetrocede = commissionTotale * (parseInt(form.partRetrocedee) / 100);
                const montantConserve = commissionTotale - montantRetrocede;
                const fmt = (n) => Math.round(n).toLocaleString('fr-BE');

                return (
                  <div style={{ background: "#002B54", borderRadius: 12, padding: "18px 20px" }}>
                    {/* Ligne 1 : commission totale */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Commission totale estimée
                      </label>
                      <div style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>
                        {commissionTotale > 0 ? `${fmt(commissionTotale)} €` : "— €"}
                      </div>
                    </div>

                    {/* Jauge de rétrocession */}
                    <div style={{ paddingTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                          Part rétrocédée à l'apporteur
                        </label>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#FF9500" }}>
                          {form.partRetrocedee}%
                        </span>
                      </div>

                      {/* Slider 5% → 60% par paliers de 5 */}
                      <div style={{ marginBottom: 16 }}>
                        <style>{`
                          .retro-slider {
                            -webkit-appearance: none; appearance: none;
                            width: 100%; height: 8px; border-radius: 99px;
                            background: rgba(255,255,255,0.12);
                            outline: none; cursor: pointer;
                          }
                          .retro-slider::-webkit-slider-thumb {
                            -webkit-appearance: none; appearance: none;
                            width: 22px; height: 22px; border-radius: 50%;
                            background: #FF9500; cursor: pointer;
                            border: 3px solid #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                          }
                          .retro-slider::-moz-range-thumb {
                            width: 22px; height: 22px; border-radius: 50%;
                            background: #FF9500; cursor: pointer;
                            border: 3px solid #fff;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                          }
                        `}</style>
                        <input
                          type="range"
                          className="retro-slider"
                          min={5}
                          max={60}
                          step={5}
                          value={form.partRetrocedee}
                          onChange={e => setForm({ ...form, partRetrocedee: parseInt(e.target.value) })}
                          style={{
                            background: `linear-gradient(to right, #FF9500 0%, #FF9500 ${((form.partRetrocedee - 5) / 55) * 100}%, rgba(255,255,255,0.12) ${((form.partRetrocedee - 5) / 55) * 100}%, rgba(255,255,255,0.12) 100%)`,
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>5%</span>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>60%</span>
                        </div>
                      </div>

                      {/* Montants détaillés */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.25)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                            Pour l'apporteur
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#FF9500" }}>
                            {commissionTotale > 0 ? `${fmt(montantRetrocede)} €` : "— €"}
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                            Vous conservez
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
                            {commissionTotale > 0 ? `${fmt(montantConserve)} €` : "— €"}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "12px 0 0", lineHeight: 1.5 }}>
                        Montant versé à l'agence qui vous apporte un acheteur si la vente aboutit.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </FormSection>

            {/* Type & État */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              title="Type de bien"
              subtitle="Catégorie et état"
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormSelect
                  label="Type"
                  value={form.typeBien}
                  onChange={val => setForm({ ...form, typeBien: val })}
                  options={TYPE_BIEN_OPTIONS}
                  placeholder="Sélectionner"
                  required
                />
                <FormSelect
                  label="État"
                  value={form.etatBien}
                  onChange={val => setForm({ ...form, etatBien: val })}
                  options={ETAT_BIEN_OPTIONS}
                  placeholder="Sélectionner"
                  required
                />
              </div>
            </FormSection>

            {/* Caractéristiques */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
              title="Caractéristiques"
              subtitle="Surface et aménagements"
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                <FormInput label="Chambres" name="nbrChambres" type="number" value={form.nbrChambres} onChange={handleChange} required min="0" placeholder="3" />
                <FormInput label="Salles de bain" name="nbrSdb" type="number" value={form.nbrSdb} onChange={handleChange} min="0" placeholder="2" />
                <FormInput label="Surface habitable (m²)" name="m2Habitable" type="number" value={form.m2Habitable} onChange={handleChange} required min="0" placeholder="120" />
                <FormInput label="Terrain (m²)" name="m2Terrain" type="number" value={form.m2Terrain} onChange={handleChange} min="0" placeholder="500" />
              </div>
            </FormSection>

            {/* PEB & Revenu */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
              title="Énergie & Fiscalité"
              subtitle="Performance énergétique et revenu cadastral"
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <FormSelect label="PEB" value={form.peb} onChange={val => setForm({ ...form, peb: val })} options={PEB_OPTIONS} placeholder="Sélectionner" />
                <FormInput label="Revenu cadastral (€)" name="revenuCadastral" type="number" value={form.revenuCadastral} onChange={handleChange} min="0" placeholder="1200" />
                <FormInput label="Rendement locatif (%)" name="rendementLocatif" type="number" value={form.rendementLocatif} onChange={handleChange} min="0" max="100" step="0.1" placeholder="4.5" />
              </div>
            </FormSection>

            {/* Photos */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
              title="Photos"
              subtitle="Images du bien (maximum 10)"
            >
              <PhotoUploader 
                photos={photos} 
                setPhotos={setPhotos} 
                uploading={uploading} 
                setUploading={setUploading} 
                setError={setError} 
              />
            </FormSection>

            {/* Description */}
            <FormSection
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              title="Description"
              subtitle="Présentation courte du bien"
            >
              <FormInput
                label="Description courte"
                name="descriptionCourte"
                type="textarea"
                value={form.descriptionCourte}
                onChange={handleChange}
                rows={4}
                placeholder="Points forts, emplacement, particularités..."
              />
              
              <div style={{ marginTop: 12 }}>
                <FormInput
                  label="Lien vers l'annonce complète"
                  name="lienAnnonce"
                  type="url"
                  value={form.lienAnnonce}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </FormSection>

            {/* Bouton mobile */}
            <button 
              type="submit" 
              disabled={loading || !isFormValid} 
              className="bien-form-submit-mobile"
              style={{ 
                display: "none", 
                width: "100%", 
                padding: 14, 
                borderRadius: 8, 
                background: !isFormValid || loading ? "#E5E7EB" : "#FF9500", 
                color: !isFormValid || loading ? "#9CA3AF" : "#FFFFFF", 
                fontWeight: 700, 
                fontSize: 14, 
                border: "none", 
                cursor: !isFormValid || loading ? "not-allowed" : "pointer", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 8, 
                marginBottom: 12 
              }}
            >
              {loading ? (mode === "edit" ? "Enregistrement..." : "Publication...") : (mode === "edit" ? "Enregistrer →" : "Publier le bien →")}
            </button>
          </div>

          {/* SIDEBAR RÉCAP */}
          <FormRecap 
            form={form} 
            photos={photos} 
            loading={loading} 
            isFormValid={isFormValid} 
            mode={mode}
            deleting={deleting}
            statut={initialData?.statut}
            onToggleStatut={handleToggleStatut}
            onDelete={handleDelete}
          />
        </div>
      </form>
    </div>
  );
}