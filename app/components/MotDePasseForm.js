"use client";
import { useState } from "react";

function PasswordInput({ value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 12, border: "1.5px solid #E8EDF2", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#FAFDFD", color: "#002B54", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "#FF9500"}
        onBlur={e => e.target.style.borderColor = "#E8EDF2"}
      />
      <button type="button" onClick={() => setShow(!show)}
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", padding: 0 }}>
        {show
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  );
}

export default function MotDePasseForm() {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const conditions = [
    { label: "9 caractères min.", ok: form.new.length >= 9 },
    { label: "Une majuscule", ok: /[A-Z]/.test(form.new) },
    { label: "Un chiffre", ok: /[0-9]/.test(form.new) },
    { label: "Un symbole (!@#...)", ok: /[^A-Za-z0-9]/.test(form.new) },
  ];
  const allConditionsOk = conditions.every(c => c.ok);
  const isValid = form.current && allConditionsOk && form.new === form.confirm;
  const forceOk = conditions.filter(c => c.ok).length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.new !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (!allConditionsOk) { setError("Le mot de passe ne respecte pas les critères de sécurité"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.new }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Une erreur est survenue");
    else { setSuccess(true); setForm({ current: "", new: "", confirm: "" }); }
  }

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 700, color: "#5A6B7D",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px",
  };

  // Libellé force du mot de passe
  const forceLabel = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"][forceOk];
  const forceColor = ["#EF4444", "#EF4444", "#F59E0B", "#FF9500", "#10B981"][forceOk];

  if (success) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
        <div style={{ background: "#F0FDF4", borderRadius: 20, border: "1px solid #BBF7D0", padding: "48px 40px", textAlign: "center", maxWidth: 400, width: "100%" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#16A34A" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#15803D", margin: "0 0 10px" }}>Mot de passe modifié !</h3>
          <p style={{ fontSize: 13, color: "#16A34A", margin: "0 0 24px", lineHeight: 1.6 }}>Votre mot de passe a été mis à jour avec succès.</p>
          <button onClick={() => setSuccess(false)}
            style={{ background: "#002B54", color: "#fff", padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Modifier à nouveau
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .mdp-grid { grid-template-columns: 1fr !important; }
          .mdp-banner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .mdp-banner-force { width: 100% !important; }
        }
      `}</style>

      {/* Bannière */}
      <div className="mdp-banner" style={{
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
            color: "#fff", boxShadow: "0 6px 20px rgba(255,149,0,0.35)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Sécurité du compte
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              Modifiez votre mot de passe de connexion
            </p>
          </div>
        </div>

        <div className="mdp-banner-force" style={{ position: "relative", zIndex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Force du mot de passe</span>
            {form.new.length > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: forceColor }}>{forceLabel}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1, height: 7, borderRadius: 99,
                background: i < forceOk ? forceColor : "rgba(255,255,255,0.1)",
                transition: "background 0.3s ease",
              }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "8px 0 0" }}>
            {form.new.length > 0 ? `${forceOk}/4 critères respectés` : "Saisissez un nouveau mot de passe"}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Grille principale — pleine largeur */}
      <div className="mdp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* Colonne gauche — le formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Vérification */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0 }}>Vérification</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Confirmez votre identité</p>
              </div>
            </div>
            <label style={labelStyle}>Mot de passe actuel *</label>
            <PasswordInput value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} placeholder="Votre mot de passe actuel" required />
          </div>

          {/* Nouveau mot de passe */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: 0 }}>Nouveau mot de passe</h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Choisissez un mot de passe sécurisé</p>
              </div>
            </div>

            <div className="mdp-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nouveau mot de passe *</label>
                <PasswordInput value={form.new} onChange={e => setForm({ ...form, new: e.target.value })} placeholder="Nouveau mot de passe" required />
              </div>
              <div>
                <label style={labelStyle}>Confirmation *</label>
                <PasswordInput value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Répétez le mot de passe" required />
              </div>
            </div>

            {/* Critères */}
            {form.new.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: form.confirm ? 12 : 0 }}>
                {conditions.map((cond, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: cond.ok ? "#F0FDF4" : "#FAFDFD", borderRadius: 9, border: `1px solid ${cond.ok ? "#DCFCE7" : "#F0F3F7"}` }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, background: cond.ok ? "#10B981" : "#E8EDF2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {cond.ok && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                    </div>
                    <span style={{ fontSize: 12, color: cond.ok ? "#15803D" : "#9CA3AF", fontWeight: cond.ok ? 600 : 400 }}>{cond.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Message correspondance */}
            {form.confirm && form.new !== form.confirm && (
              <p style={{ fontSize: 12, color: "#EF4444", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Les mots de passe ne correspondent pas
              </p>
            )}
            {form.confirm && form.new === form.confirm && allConditionsOk && (
              <p style={{ fontSize: 12, color: "#10B981", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Les mots de passe correspondent
              </p>
            )}
          </div>

          <button type="submit" disabled={loading || !isValid}
            style={{ padding: "15px", borderRadius: 14, background: !isValid || loading ? "#E5E7EB" : "#FF9500", color: !isValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isValid && !loading ? "0 6px 20px rgba(255,149,0,0.3)" : "none" }}>
            {loading
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Modification en cours...</>
              : <>Modifier le mot de passe <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            }
          </button>
        </div>

        {/* Colonne droite — infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

          {/* Conseils */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#002B54", margin: 0 }}>Conseils de sécurité</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🔐", text: "Utilisez un mot de passe unique, jamais réutilisé ailleurs." },
                { icon: "🔡", text: "Mélangez majuscules, chiffres et caractères spéciaux." },
                { icon: "📏", text: "Visez 12 caractères minimum pour une sécurité optimale." },
                { icon: "🔄", text: "Changez-le régulièrement, au moins une fois par an." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#FAFDFD", borderRadius: 10 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12.5, color: "#5A6B7D", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infos */}
          <div style={{ background: "#001B38", borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,149,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Bon à savoir</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Votre session restera active après le changement.",
                "En cas d'oubli, réinitialisez depuis la page de connexion.",
                "Contactez le support si vous suspectez un accès non autorisé.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 9 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF9500", flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}