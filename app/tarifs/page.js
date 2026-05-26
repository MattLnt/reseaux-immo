import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export default function TarifsPage() {
  const inclus = [
    { icon: "🏠", title: "Biens illimités", desc: "Encodez autant de mandats que vous le souhaitez sur la plateforme." },
    { icon: "🔍", title: "Catalogue complet du réseau", desc: "Accès à tous les biens des autres agences avec filtres avancés." },
    { icon: "🤝", title: "Mise en relation acheteurs", desc: "Envoyez les coordonnées de vos acheteurs aux agences détentrices." },
    { icon: "💬", title: "Messagerie interne", desc: "Échangez directement et en sécurité avec les autres agences." },
    { icon: "🔔", title: "Alertes & notifications", desc: "Soyez prévenu par email à chaque nouveau bien ou nouveau contact." },
    { icon: "📊", title: "Tableau de bord & statistiques", desc: "Suivez vos biens, vos contacts et vos performances en temps réel." },
    { icon: "📇", title: "Gestion des contacts", desc: "Suivez chaque contact envoyé ou reçu : signé, en cours, etc." },
    { icon: "🏢", title: "Profil agence complet", desc: "Bureaux, horaires, logo, photos et description de votre agence." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease-out; }
        @media (max-width: 768px) {
          .tarifs-hero { padding: 110px 24px 60px !important; }
          .tarifs-hero h1 { font-size: 36px !important; }
          .tarifs-section { padding: 64px 24px !important; }
          .tarifs-card { padding: 36px 28px !important; }
          .tarifs-prix { font-size: 64px !important; }
          .tarifs-inclus-grid { grid-template-columns: 1fr !important; }
          .tarifs-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .tarifs-cta h2 { font-size: 30px !important; }
        }
      `}</style>

      <PublicNav />

      {/* Hero */}
      <div className="tarifs-hero" style={{ background: "#001B38", padding: "160px 48px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)", borderRadius: 24, padding: "8px 18px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF9500" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", letterSpacing: "0.08em" }}>TARIF UNIQUE</span>
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 700, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Un seul abonnement.<br />Tout le réseau.
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Pas de plans compliqués, pas de commission cachée. Un tarif clair pour accéder à l'ensemble du réseau d'agences immobilières belges.
          </p>
        </div>
      </div>

      {/* Carte prix */}
      <div className="tarifs-section" style={{ padding: "100px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="tarifs-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "center" }}>

            {/* Colonne gauche — prix */}
            <div className="tarifs-card" style={{ background: "#001B38", borderRadius: 24, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,149,0,0.15)", border: "1px solid rgba(255,149,0,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FF9500", letterSpacing: "0.06em" }}>AGENCE PARTENAIRE</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span className="tarifs-prix" style={{ fontSize: 84, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>299 €</span>
                  <span style={{ fontSize: 20, color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>/mois</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 32px" }}>HTVA · Sans engagement · Résiliable à tout moment</p>

                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 28 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                  {["Accès complet au réseau d'agences", "Aucune commission prélevée par la plateforme", "Toutes les fonctionnalités incluses", "Support par email sous 24h"].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,149,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#FF9500", color: "#fff", padding: "16px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 20px rgba(255,149,0,0.3)" }}>
                  Inscrire mon agence
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "14px 0 0", textAlign: "center" }}>
                  Inscription validée manuellement par notre équipe.
                </p>
              </div>
            </div>

            {/* Colonne droite — explication modèle */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Comment ça marche</p>
              <h2 style={{ fontSize: 34, fontWeight: 700, color: "#002B54", margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                La plateforme ne prend aucune commission
              </h2>
              <p style={{ fontSize: 16, color: "#5A6B7D", lineHeight: 1.8, margin: "0 0 28px" }}>
                Votre abonnement vous donne un accès complet au réseau. Lorsqu'une vente se conclut entre deux agences, c'est <strong style={{ color: "#002B54" }}>l'agence détentrice du mandat qui fixe librement le taux de commission</strong> qu'elle rétrocède à l'agence ayant apporté l'acheteur.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { num: "01", text: "Vous encodez un bien et indiquez le taux de commission que vous offrez à l'agence apporteuse." },
                  { num: "02", text: "Une autre agence trouve un acheteur et vous transmet ses coordonnées via la plateforme." },
                  { num: "03", text: "La vente se conclut : vous rétribuez l'agence apporteuse selon le taux annoncé. Réseaux Immo ne touche rien." },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#002B54", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#FF9500", flexShrink: 0 }}>
                      {step.num}
                    </div>
                    <p style={{ fontSize: 14, color: "#5A6B7D", lineHeight: 1.6, margin: 0, paddingTop: 7 }}>{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tout est inclus */}
      <div className="tarifs-section" style={{ padding: "100px 48px", background: "#FAFDFD", borderTop: "1px solid #E8EDF2", borderBottom: "1px solid #E8EDF2" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Tout est inclus</p>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#002B54", margin: 0, letterSpacing: "-0.03em" }}>
              Une seule offre, toutes les fonctionnalités
            </h2>
          </div>
          <div className="tarifs-inclus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {inclus.map((f, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", padding: "28px 24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,149,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: "0 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#5A6B7D", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

  {/* CTA final */}
        <div className="tarifs-cta tarifs-section" style={{ padding: "100px 48px", background: "#FAFDFD", textAlign: "center" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E8EDF2", borderRadius: 24, padding: "64px 48px", boxShadow: "0 4px 24px rgba(0,43,84,0.06)" }}>
              <h2 style={{ fontSize: 42, fontWeight: 700, color: "#002B54", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                Prêt à rejoindre le réseau ?
              </h2>
              <p style={{ fontSize: 17, color: "#5A6B7D", margin: "0 0 36px", lineHeight: 1.7 }}>
                Inscrivez votre agence dès aujourd'hui et commencez à vendre plus, ensemble.
              </p>
              <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FF9500", color: "#fff", padding: "18px 40px", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 24px rgba(255,149,0,0.35)" }}>
                Inscrire mon agence — 299€/mois
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>

      <PublicFooter />
    </div>
  );
}