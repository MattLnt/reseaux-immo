"use client";
import { useState } from "react";
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const faqs = [
  {
    categorie: "Général",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    desc: "Présentation de la plateforme",
    questions: [
      { q: "Qu'est-ce que OnShare ?", r: "OnShare est une plateforme privée qui met en relation les agences immobilières. Une agence peut partager un bien sur le réseau, et une autre agence peut lui apporter un acheteur en échange d'une commission." },
      { q: "Qui peut utiliser la plateforme ?", r: "La plateforme est réservée aux agences immobilières professionnelles. Chaque inscription est validée manuellement par notre équipe avant l'accès au réseau." },
      { q: "À qui s'adresse OnShare ?", r: "OnShare s'adresse à toutes les agences immobilières qui souhaitent partager leurs mandats et accéder à un réseau d'acheteurs au-delà de leurs propres contacts." },
    ]
  },
  {
    categorie: "Le réseau",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    desc: "Le principe du partage de biens",
    questions: [
      { q: "Comment fonctionne le partage de biens ?", r: "L'agence qui détient le mandat encode son bien sur la plateforme avec le taux de commission qu'elle offre. Une autre agence qui a un acheteur potentiel transmet ses coordonnées. Si la vente aboutit, l'agence détentrice rétribue l'agence apporteuse selon le taux annoncé." },
      { q: "Qui garde le contact avec le vendeur ?", r: "L'agence détentrice du mandat reste seule en contact avec le client vendeur. L'agence apporteuse ne fait que transmettre les coordonnées d'un acheteur potentiel : elle n'a aucun mandat et n'intervient pas dans la vente." },
      { q: "Qui fixe le taux de commission ?", r: "C'est l'agence détentrice du bien qui fixe librement le taux de commission qu'elle rétrocède à l'agence ayant apporté l'acheteur. Ce taux est affiché sur chaque bien du catalogue." },
      { q: "OnShare prend-elle une commission sur les ventes ?", r: "Non. La plateforme ne prélève aucune commission sur les transactions. Votre abonnement vous donne accès au réseau, et les agences s'arrangent librement entre elles sur la commission d'apport." },
    ]
  },
  {
    categorie: "Les biens",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    desc: "Encoder et gérer vos biens",
    questions: [
      { q: "Combien de biens puis-je encoder ?", r: "Il n'y a aucune limite. Vous pouvez encoder autant de biens que vous le souhaitez sur la plateforme." },
      { q: "Quelles informations dois-je renseigner pour un bien ?", r: "Prix, localisation, nombre de chambres et salles de bain, surface habitable et terrain, photos, type et état du bien, taux de commission proposé, et le lien vers l'annonce complète de votre site. Le PEB, le revenu cadastral et le rendement locatif sont facultatifs." },
      { q: "Quels statuts un bien peut-il avoir ?", r: "Un bien peut être en vente, sous option ou vendu. Vous pouvez modifier le statut à tout moment depuis votre tableau de bord pour informer les autres agences en temps réel." },
      { q: "Puis-je modifier ou archiver mes biens ?", r: "Oui, vous pouvez modifier, archiver ou supprimer vos biens à tout moment depuis votre tableau de bord." },
      { q: "Qui peut voir mes biens ?", r: "Seules les agences partenaires vérifiées du réseau peuvent voir vos biens. Ils ne sont jamais visibles par le grand public." },
    ]
  },
  {
    categorie: "Abonnement",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    desc: "Tarif et facturation",
    questions: [
      { q: "Combien coûte l'abonnement ?", r: "L'accès au réseau coûte 150 €/mois HTVA par agence dans le cadre de notre offre de lancement. Cet abonnement unique inclut toutes les fonctionnalités de la plateforme, sans frais caché." },
      { q: "Y a-t-il un engagement ?", r: "L'abonnement est mensuel. Vous pouvez le résilier avec un délai de préavis raisonnable à communiquer à notre équipe." },
      { q: "Comment se passe la facturation ?", r: "Dans un premier temps, la facturation des abonnements est gérée directement par notre équipe, en dehors de la plateforme. Vous serez accompagné lors de votre inscription." },
      { q: "Comment résilier mon abonnement ?", r: "Pour résilier votre abonnement, contactez notre équipe par email à contact@onshare.be. Nous vous accompagnerons dans la procédure et vous indiquerons le délai de préavis applicable." },
      { q: "Que se passe-t-il après mon inscription ?", r: "Votre inscription est validée manuellement par notre équipe afin de garantir que seules des agences professionnelles rejoignent le réseau. Vous recevrez une confirmation par email une fois votre compte activé." },
    ]
  },
];

function FAQItem({ question, reponse, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F0F3F7", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: open ? "#FF9500" : "#D1D5DB", minWidth: 20, letterSpacing: "0.02em", flexShrink: 0 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: open ? "#002B54" : "#374151", lineHeight: 1.4 }}>{question}</span>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: open ? "#002B54" : "#FAFDFD", border: `1px solid ${open ? "#002B54" : "#E8EDF2"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#fff" : "#9CA3AF"} strokeWidth="2.5"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ paddingLeft: 32, paddingBottom: 20 }}>
          <p style={{ fontSize: 14, color: "#5A6B7D", lineHeight: 1.8, margin: 0, borderLeft: "2px solid #FF9500", paddingLeft: 16 }}>{reponse}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [categorie, setCategorie] = useState("Général");
  const current = faqs.find(f => f.categorie === categorie);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .faq-hero { padding: 130px 24px 56px !important; }
          .faq-hero h1 { font-size: 36px !important; }
          .faq-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .faq-layout { grid-template-columns: 1fr !important; padding: 40px 20px !important; gap: 24px !important; }
          .faq-sidebar { position: static !important; }
          .faq-cats { flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; }
          .faq-cat-btn { flex: 1 !important; min-width: calc(50% - 4px) !important; }
          .faq-tarifs-card { display: none !important; }
          .faq-cta { grid-template-columns: 1fr !important; gap: 16px !important; }
          .faq-cta a { text-align: center !important; justify-content: center !important; }
        }
      `}</style>

      <PublicNav dark />

      {/* Hero */}
      <div className="faq-hero" style={{ background: "#001B38", padding: "160px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 450, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#FF9500", letterSpacing: "0.1em", margin: "0 0 16px" }}>FAQ</p>
          <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Questions fréquentes
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 auto 40px", lineHeight: 1.8, maxWidth: 460 }}>
            Tout ce que vous devez savoir sur le réseau OnShare.
          </p>
          <div className="faq-stats" style={{ display: "inline-grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {faqs.map(f => (
              <div key={f.categorie} style={{ padding: "14px 20px", background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#FF9500", marginBottom: 3 }}>{f.questions.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{f.categorie}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="faq-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }}>

        {/* Sidebar */}
        <div className="faq-sidebar" style={{ position: "sticky", top: 88 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Catégories</p>
          <div className="faq-cats" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {faqs.map(f => {
              const isActive = categorie === f.categorie;
              return (
                <button key={f.categorie} onClick={() => setCategorie(f.categorie)} className="faq-cat-btn"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: `1px solid ${isActive ? "#002B54" : "#E8EDF2"}`, background: isActive ? "#002B54" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(255,149,0,0.15)" : "#FAFDFD", color: isActive ? "#FF9500" : "#9CA3AF", transition: "all 0.15s" }}>
                    {f.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#fff" : "#002B54", marginBottom: 2 }}>{f.categorie}</div>
                    <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{f.questions.length} questions</div>
                  </div>
                  {isActive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              );
            })}
          </div>

          <div className="faq-tarifs-card" style={{ marginTop: 24, background: "#FAFDFD", borderRadius: 14, border: "1px solid #E8EDF2", padding: "18px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#002B54", margin: "0 0 6px" }}>Voir les tarifs</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 12px", lineHeight: 1.5 }}>Retrouvez le détail complet de notre offre.</p>
            <Link href="/tarifs" style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Page tarifs →
            </Link>
          </div>
        </div>

        {/* Questions */}
        <div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500", flexShrink: 0 }}>
                {current?.icon}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#002B54", margin: 0, letterSpacing: "-0.02em" }}>{categorie}</h2>
            </div>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{current?.desc} · {current?.questions.length} questions</p>
          </div>

          <div>
            {current?.questions.map((item, i) => (
              <FAQItem key={i} question={item.q} reponse={item.r} index={i} />
            ))}
          </div>

          <div className="faq-cta" style={{ marginTop: 48, background: "#001B38", borderRadius: 16, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Vous n'avez pas trouvé votre réponse ?</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>Notre équipe répond à toutes vos questions sous 24h.</p>
            </div>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FF9500", color: "#fff", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}