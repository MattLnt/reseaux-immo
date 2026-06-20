import Link from "next/link";
import PublicNav from "./components/PublicNav";
import PublicFooter from "./components/PublicFooter";
import DashboardMockup from "./components/DashboardMockup";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        @media (max-width: 1024px) {
          .hero-section { padding: 120px 24px 80px !important; }
          .hero-title { font-size: 42px !important; }
          .hero-subtitle { font-size: 18px !important; }
          .grid-3 { grid-template-columns: 1fr !important; gap: 24px !important; }
          .grid-2 { grid-template-columns: 1fr !important; gap: 40px !important; }
          .section-padding { padding: 80px 24px !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
          .home-h2 { font-size: 34px !important; }
        }
      `}</style>

      <PublicNav />

      <main>

        {/* Hero — avec dégradé subtil et halo orange */}
        <div className="hero-section" style={{
          paddingTop: 180,
          paddingBottom: 120,
          background: "linear-gradient(180deg, #FAFDFD 0%, #FFFFFF 60%, #FAFDFD 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Halos décoratifs */}
          <div style={{ position: "absolute", top: -200, left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 100, right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(133,168,249,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
            <div className="fade-in" style={{ textAlign: "center", marginBottom: 80 }}>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.25)", borderRadius: 24, padding: "8px 20px", marginBottom: 40 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF9500" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#CC7700", letterSpacing: "0.05em" }}>RÉSEAU PRIVÉ</span>
              </div>

              <h1 className="hero-title" style={{ fontSize: 72, fontWeight: 600, color: "#002B54", lineHeight: 1.05, margin: "0 0 32px", letterSpacing: "-0.04em", maxWidth: 1100, marginLeft: "auto", marginRight: "auto" }}>
                Vendez vos biens<br />à plusieurs agences
              </h1>

              <p className="hero-subtitle" style={{ fontSize: 22, color: "#5A6B7D", lineHeight: 1.6, maxWidth: 720, margin: "0 auto 56px", fontWeight: 400 }}>
                Le réseau qui connecte les agences immobilières. Partagez vos mandats, trouvez des acheteurs, concluez plus de ventes.
              </p>

              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 100 }}>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FF9500", color: "#FFFFFF", padding: "18px 36px", borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 14px rgba(255,149,0,0.3)" }}>
                  Inscrire mon agence
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href="/tarifs" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFFFFF", border: "1px solid #E8EDF2", color: "#002B54", padding: "18px 36px", borderRadius: 10, fontSize: 16, fontWeight: 500, textDecoration: "none" }}>
                  Voir les tarifs
                </Link>
              </div>

              {/* Hero — Mockup du vrai dashboard */}
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <DashboardMockup />
              </div>
            </div>
          </div>
        </div>

        {/* Le principe — 2 rôles */}
        <div className="section-padding" style={{ padding: "120px 48px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Le principe</p>
              <h2 className="home-h2" style={{ fontSize: 48, fontWeight: 600, color: "#002B54", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
                Deux agences, une vente
              </h2>
              <p style={{ fontSize: 19, color: "#5A6B7D", maxWidth: 720, margin: "0 auto", lineHeight: 1.6 }}>
                Vous souhaitez vendre plus vite ? Une autre agence a peut-être l'acheteur. Tout le monde y gagne.
              </p>
            </div>

            <div className="roles-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Agence détentrice */}
              <div style={{ background: "#FAFDFD", border: "1px solid #E8EDF2", borderRadius: 20, padding: 40 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,149,0,0.1)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#CC7700", letterSpacing: "0.05em" }}>VOUS DÉTENEZ LE MANDAT</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: "#002B54", margin: "0 0 12px" }}>
                  Encodez le bien
                </h3>
                <p style={{ fontSize: 15, color: "#5A6B7D", lineHeight: 1.7, margin: "0 0 20px" }}>
                  Vous avez le mandat d'un bien. Encodez-le sur la plateforme avec photos, détails et le taux de commission que vous offrez à l'agence qui vous apportera un acheteur.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Vous gardez le contact avec le vendeur", "Vous fixez votre taux de commission", "Vous recevez les acheteurs des autres agences"].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 14, color: "#002B54" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agence apporteuse */}
              <div style={{ background: "#FAFDFD", border: "1px solid #E8EDF2", borderRadius: 20, padding: 40 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(133,168,249,0.15)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5A7FE0", letterSpacing: "0.05em" }}>VOUS APPORTEZ L'ACHETEUR</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: "#002B54", margin: "0 0 12px" }}>
                  Trouvez l'acheteur
                </h3>
                <p style={{ fontSize: 15, color: "#5A6B7D", lineHeight: 1.7, margin: "0 0 20px" }}>
                  Vous avez un client qui cherche ce type de bien ? Transmettez ses coordonnées à l'agence détentrice via la plateforme. Vous êtes commissionné pour l'apport.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Vous proposez plus de biens à vos clients", "Vous touchez une commission d'apport", "Aucun mandat à gérer, juste la mise en relation"].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7FE0" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 14, color: "#002B54" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div id="fonctionnalites" className="section-padding" style={{ padding: "120px 48px", background: "#FAFDFD", borderTop: "1px solid #E8EDF2", borderBottom: "1px solid #E8EDF2" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Comment ça marche</p>
              <h2 className="home-h2" style={{ fontSize: 48, fontWeight: 600, color: "#002B54", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
                Trois étapes simples
              </h2>
              <p style={{ fontSize: 19, color: "#5A6B7D", maxWidth: 600, margin: "0 auto" }}>
                Pour partager vos mandats et trouver des acheteurs
              </p>
            </div>

            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
              {[
                {
                  num: "01",
                  title: "Encodez vos mandats",
                  desc: "Créez vos fiches biens en quelques minutes : photos, détails et taux de commission offert",
                  img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
                },
                {
                  num: "02",
                  title: "Partagez avec le réseau",
                  desc: "Vos biens sont visibles uniquement par les agences partenaires vérifiées",
                  img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"
                },
                {
                  num: "03",
                  title: "Recevez des acheteurs",
                  desc: "Les agences avec un acheteur potentiel vous transmettent ses coordonnées",
                  img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
                }
              ].map((step, i) => (
                <div key={i}>
                  <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 24, border: "1px solid #E8EDF2" }}>
                    <img src={step.img} alt={step.title} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: "#002B54", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#FF9500", marginBottom: 20 }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: "#002B54", margin: "0 0 12px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 16, color: "#5A6B7D", lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="section-padding" style={{ padding: "120px 48px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Fonctionnalités</p>
              <h2 className="home-h2" style={{ fontSize: 48, fontWeight: 600, color: "#002B54", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
                Tout pour gérer vos mandats
              </h2>
            </div>

            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {[
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
                  title: "Catalogue complet",
                  desc: "Accédez à tous les biens du réseau avec filtres avancés"
                },
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
                  title: "Galeries photos",
                  desc: "Jusqu'à 10 photos par bien en haute qualité"
                },
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                  title: "Tableau de bord",
                  desc: "Suivez vos biens et performances en temps réel"
                },
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                  title: "Messagerie",
                  desc: "Échangez directement avec les autres agences"
                },
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
                  title: "Encodage acheteurs",
                  desc: "Centralisez vos acheteurs potentiels et leurs critères"
                },
                {
                  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
                  title: "Alertes email",
                  desc: "Notifié à chaque nouveau bien ou nouveau contact"
                }
              ].map((feature, i) => (
                <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8EDF2", borderRadius: 16, padding: 40, textAlign: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: 12, background: "rgba(133,168,249,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: "#002B54", margin: "0 0 12px" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: 15, color: "#5A6B7D", lineHeight: 1.6, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Le Réseau — fond foncé */}
        <div id="reseau" className="section-padding" style={{ padding: "120px 48px", background: "#001B38" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#FF9500", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Le réseau</p>
                <h2 className="home-h2" style={{ fontSize: 48, fontWeight: 600, color: "#FFFFFF", margin: "0 0 24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  Un réseau privé et de confiance
                </h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 40 }}>
                  Rejoignez un réseau exclusif d'agences immobilières vérifiées. Chaque inscription est validée manuellement. Vos biens ne sont jamais visibles par le grand public.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { text: "Agences vérifiées et validées manuellement" },
                    { text: "Accès 100% privé, réservé aux partenaires" },
                    { text: "Vos données et celles de vos clients sécurisées" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,149,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop"
                  alt="Réseau"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarif */}
        <div className="section-padding" style={{ padding: "120px 48px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#CC7700", letterSpacing: "0.1em", margin: "0 0 16px", textTransform: "uppercase" }}>Offre de lancement</p>
            <h2 className="home-h2" style={{ fontSize: 48, fontWeight: 600, color: "#002B54", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
              Un seul abonnement, tout inclus
            </h2>
            <p style={{ fontSize: 18, color: "#5A6B7D", lineHeight: 1.6, margin: "0 0 40px" }}>
              Pas de plans compliqués, aucune commission prélevée par la plateforme.
            </p>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 700, color: "#002B54", letterSpacing: "-0.04em" }}>150 €</span>
              <span style={{ fontSize: 20, color: "#9CA3AF" }}>/mois HTVA</span>
            </div>
            <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 32px" }}>Offre de lancement</p>
            <div>
              <Link href="/tarifs" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FF9500", color: "#FFFFFF", padding: "16px 36px", borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 14px rgba(255,149,0,0.3)" }}>
                Voir le détail de l'offre
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Final — fond clair, carte */}
        <div className="section-padding" style={{ padding: "120px 48px", background: "#FAFDFD" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ background: "#001B38", borderRadius: 24, padding: "72px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: 44, fontWeight: 600, color: "#FFFFFF", margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                  Prêt à rejoindre le réseau ?
                </h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", margin: "0 0 40px", lineHeight: 1.7 }}>
                  Inscrivez votre agence et commencez à vendre plus, ensemble.
                </p>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FF9500", color: "#FFFFFF", padding: "18px 44px", borderRadius: 12, fontSize: 17, fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px rgba(255,149,0,0.35)" }}>
                  Inscrire mon agence
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>

      <PublicFooter />
    </div>
  );
}