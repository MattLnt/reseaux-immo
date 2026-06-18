"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState(""); // 'credentials' | 'pending'
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorType("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      // signIn() a échoué → on vérifie pourquoi
      try {
        const check = await fetch("/api/auth/check-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await check.json();

        if (data.status === "pending_or_disabled") {
          setError("Votre compte n'est pas encore activé ou a été désactivé. Vous recevrez un email dès qu'un administrateur l'aura validé.");
          setErrorType("pending");
        } else {
          setError("Email ou mot de passe incorrect");
          setErrorType("credentials");
        }
      } catch {
        setError("Email ou mot de passe incorrect");
        setErrorType("credentials");
      }

      setLoading(false);
      return;
    }

    // Connexion réussie
    await new Promise(resolve => setTimeout(resolve, 500));
    const session = await fetch("/api/auth/session").then(r => r.json());
    const role = session?.user?.role;

    if (role === "AGENCE") router.push("/dashboard/agence");
    else if (role === "ADMIN") router.push("/dashboard/admin");
    else router.push("/");
  }

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #E8EDF2",
    borderRadius: 8,
    padding: "12px 14px 12px 40px",
    fontSize: 14,
    color: "#002B54",
    outline: "none",
    boxSizing: "border-box",
    background: "#FAFDFD",
    transition: "all 0.2s ease"
  };

  // Couleurs de l'alerte selon le type d'erreur
  const errorStyles = errorType === "pending"
    ? { bg: "rgba(255,149,0,0.06)", border: "rgba(255,149,0,0.3)", color: "#CC7700" }
    : { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626" };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#002B54", padding: 20, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-hero { display: none !important; }
        }
      `}</style>

      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,149,0,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: 400, height: 400, borderRadius: "50%", background: "rgba(133,168,249,0.1)", pointerEvents: "none" }} />

      <div className="login-grid" style={{ width: "100%", maxWidth: 1100, display: "grid", gridTemplateColumns: "440px 1fr", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* Colonne gauche : Formulaire */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.25)", borderRadius: 16, padding: "5px 12px", marginBottom: 14 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: 11, color: "#CC7700", fontWeight: 700 }}>Accès sécurisé</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
              Connexion
            </h2>
            <p style={{ fontSize: 13, color: "#5A6B7D", margin: 0 }}>
              Accédez à votre espace agence
            </p>
          </div>

          {error && (
            <div style={{ background: errorStyles.bg, border: `1px solid ${errorStyles.border}`, color: errorStyles.color, fontSize: 12, borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                {errorType === "pending" ? (
                  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                ) : (
                  <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                )}
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@exemple.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••••"
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = "#FF9500"}
                  onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9CA3AF" }}>
                  {showPassword ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#E5E7EB" : "#FF9500", color: "#FFFFFF", fontWeight: 700, padding: 12, borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
              {loading ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Connexion...</>
              ) : (
                <>Se connecter</>
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#5A6B7D", margin: 0 }}>
              Pas encore de compte ?{' '}
              <Link href="/register" style={{ color: "#FF9500", fontWeight: 600, textDecoration: "none" }}>
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Colonne droite : Hero */}
        <div className="login-hero">
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0 }}>
              Réseaux <span style={{ color: "#FF9500" }}>Immo</span>
            </h1>
          </Link>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            Bon retour sur<br />la plateforme
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 32px", maxWidth: 480 }}>
            Connectez-vous pour accéder à votre espace agence et gérer vos biens en co-courtage.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Plateforme sécurisée", desc: "Accès réservé aux agences" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: "Vos biens", desc: "Gérez vos mandats exclusifs" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title: "Catalogue", desc: "Biens des autres agences" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, title: "Contacts qualifiés", desc: "Acheteurs potentiels" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 32, position: "relative", zIndex: 1 }}>
        © 2026 Réseaux Immo · Belgique
      </p>
    </main>
  );
}