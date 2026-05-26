"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const TYPE_BIEN_OPTIONS = ["APPARTEMENT", "MAISON", "VILLA", "BUREAU", "IMMEUBLE", "AUTRE"];
const PEB_OPTIONS = ["A+", "A", "B", "C", "D", "E", "F", "G"];
const libraries = ["places"];

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: `1px solid ${open ? "#FF9500" : "#E8EDF2"}`, background: "#FFFFFF", fontSize: 13, color: value ? "#002B54" : "#9CA3AF", cursor: "pointer", outline: "none", transition: "all 0.15s ease", textAlign: "left", fontWeight: value ? 600 : 400 }}>
        <span>{value || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.15s ease", flexShrink: 0, opacity: 0.5 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60, background: "#FFFFFF", borderRadius: 12, border: "1px solid #E8EDF2", boxShadow: "0 20px 40px rgba(0,43,84,0.15)", overflow: "hidden", maxHeight: 240, overflowY: "auto" }}>
            <button type="button" onClick={() => { onChange(''); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: !value ? "#FF9500" : "#5A6B7D", fontWeight: !value ? 700 : 400, background: !value ? "rgba(255,149,0,0.06)" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F0F3F7" }}>
              {placeholder}
            </button>
            {options.map(o => (
              <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: value === o ? "#FF9500" : "#5A6B7D", fontWeight: value === o ? 700 : 400, background: value === o ? "rgba(255,149,0,0.06)" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F0F3F7" }}>
                <span>{o}</span>
                {value === o && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FiltresCatalogue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filtres, setFiltres] = useState({
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
    typeBien: searchParams.get('typeBien') || '',
    nbrChambresMin: searchParams.get('nbrChambresMin') || '',
    m2Min: searchParams.get('m2Min') || '',
    m2Max: searchParams.get('m2Max') || '',
    peb: searchParams.get('peb') || '',
    localisation: searchParams.get('localisation') || '',
  });

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
    language: 'fr',
    region: 'BE'
  });

  function appliquerFiltres(nouveauxFiltres = filtres) {
    const params = new URLSearchParams();
    Object.keys(nouveauxFiltres).forEach(key => {
      if (nouveauxFiltres[key]) params.set(key, nouveauxFiltres[key]);
    });
    router.push(`/dashboard/agence/catalogue?${params.toString()}`);
  }

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      const nouveauxFiltres = { ...filtres, localisation: place.formatted_address };
      setFiltres(nouveauxFiltres);
      appliquerFiltres(nouveauxFiltres);
    }
  }

  function handleLocalisationChange(e) {
    const value = e.target.value;
    setFiltres({ ...filtres, localisation: value });
  }

  function handleChange(name, value) {
    const nouveauxFiltres = { ...filtres, [name]: value };
    setFiltres(nouveauxFiltres);
    appliquerFiltres(nouveauxFiltres);
  }

  function incrementChambres() {
    const current = parseInt(filtres.nbrChambresMin) || 0;
    const nouveauxFiltres = { ...filtres, nbrChambresMin: String(current + 1) };
    setFiltres(nouveauxFiltres);
    appliquerFiltres(nouveauxFiltres);
  }

  function decrementChambres() {
    const current = parseInt(filtres.nbrChambresMin) || 0;
    if (current > 0) {
      const nouveauxFiltres = { ...filtres, nbrChambresMin: String(current - 1) };
      setFiltres(nouveauxFiltres);
      appliquerFiltres(nouveauxFiltres);
    }
  }

  function reinitialiser() {
    setFiltres({
      prixMin: '', prixMax: '', typeBien: '', nbrChambresMin: '',
      m2Min: '', m2Max: '', peb: '', localisation: ''
    });
    router.push('/dashboard/agence/catalogue');
  }

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E8EDF2", fontSize: 13, background: "#FFFFFF", color: "#002B54", outline: "none", transition: "all 0.15s ease", fontWeight: 500 };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#5A6B7D", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" };

  const hasActiveFilters = Object.values(filtres).some(v => v !== '');

  return (
    <div style={{ position: "sticky", top: 80, background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24, boxShadow: "0 1px 3px rgba(0,43,84,0.06)" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E8EDF2" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0, letterSpacing: "-0.01em" }}>Filtres</h3>
        {hasActiveFilters && (
          <button type="button" onClick={reinitialiser}
            style={{ fontSize: 12, color: "#FF9500", background: "none", border: "none", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s ease" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            Reset
          </button>
        )}
      </div>

      {/* Prix */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Budget</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <input type="number" value={filtres.prixMin} onChange={(e) => handleChange('prixMin', e.target.value)}
              placeholder="Min" style={{ ...inputStyle, paddingRight: 28 }}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#FF9500", pointerEvents: "none" }}>€</span>
          </div>
          <div style={{ position: "relative" }}>
            <input type="number" value={filtres.prixMax} onChange={(e) => handleChange('prixMax', e.target.value)}
              placeholder="Max" style={{ ...inputStyle, paddingRight: 28 }}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#FF9500", pointerEvents: "none" }}>€</span>
          </div>
        </div>
      </div>

      {/* Type */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Type de bien</label>
        <CustomSelect
          value={filtres.typeBien}
          onChange={(val) => handleChange('typeBien', val)}
          options={TYPE_BIEN_OPTIONS}
          placeholder="Tous les types"
        />
      </div>

      {/* Chambres avec stepper */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Chambres minimum</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={decrementChambres}
            style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #E8EDF2", background: "#FFFFFF", color: "#002B54", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, transition: "all 0.15s ease" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF9500"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EDF2"}>
            −
          </button>
          <div style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: 700, color: "#002B54", padding: 8, background: "#FAFDFD", borderRadius: 8 }}>
            {filtres.nbrChambresMin || 0}
          </div>
          <button type="button" onClick={incrementChambres}
            style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #E8EDF2", background: "#FFFFFF", color: "#002B54", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, transition: "all 0.15s ease" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF9500"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EDF2"}>
            +
          </button>
        </div>
      </div>

      {/* Surface */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Surface habitable</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <input type="number" value={filtres.m2Min} onChange={(e) => handleChange('m2Min', e.target.value)}
              placeholder="Min" style={{ ...inputStyle, paddingRight: 32 }}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#FF9500", pointerEvents: "none" }}>m²</span>
          </div>
          <div style={{ position: "relative" }}>
            <input type="number" value={filtres.m2Max} onChange={(e) => handleChange('m2Max', e.target.value)}
              placeholder="Max" style={{ ...inputStyle, paddingRight: 32 }}
              onFocus={e => e.target.style.borderColor = "#FF9500"}
              onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#FF9500", pointerEvents: "none" }}>m²</span>
          </div>
        </div>
      </div>

      {/* PEB */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Performance énergétique</label>
        <CustomSelect
          value={filtres.peb}
          onChange={(val) => handleChange('peb', val)}
          options={PEB_OPTIONS}
          placeholder="Toutes classes"
        />
      </div>

      {/* Localisation avec Google Places */}
      <div style={{ marginBottom: 0 }}>
        <label style={labelStyle}>Localisation</label>
        {isLoaded ? (
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
            options={{
            componentRestrictions: { country: "be" },
            types: ["(cities)"],
            language: 'fr'
            }}
          >
            <div style={{ position: "relative" }}>
              <input type="text" value={filtres.localisation} onChange={handleLocalisationChange}
                placeholder="Bruxelles, Liège, Anvers..."
                style={{ ...inputStyle, paddingLeft: 36 }}
                onFocus={e => e.target.style.borderColor = "#FF9500"}
                onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </Autocomplete>
        ) : (
          <input type="text" placeholder="Chargement..." style={inputStyle} disabled />
        )}
      </div>
    </div>
  );
}