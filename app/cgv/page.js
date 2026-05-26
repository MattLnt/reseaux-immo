import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const sections = [
  {
    titre: "1. Objet et champ d'application",
    contenu: `Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'utilisation de la plateforme Réseaux Immo (ci-après « la Plateforme »), accessible à l'adresse reseaux-immo.be.

La Plateforme est éditée par Réseaux Immo, société de droit belge. En accédant à la Plateforme et en utilisant ses services, l'utilisateur accepte sans réserve les présentes CGV.

La Plateforme est exclusivement destinée aux agences immobilières professionnelles actives en Belgique souhaitant collaborer dans le cadre de la vente de biens immobiliers.`
  },
  {
    titre: "2. Description des services",
    contenu: `Réseaux Immo est une plateforme de co-courtage immobilier qui met en relation les agences immobilières belges.

La Plateforme permet à une agence partenaire d'encoder des biens dont elle détient le mandat exclusif, de les rendre visibles aux autres agences du réseau, de consulter le catalogue des biens partagés par les autres agences, et de transmettre les coordonnées d'acheteurs potentiels aux agences détentrices.

L'accès à l'ensemble de ces services est conditionné à la souscription d'un abonnement Agence Partenaire.`
  },
  {
    titre: "3. Inscription et compte agence",
    contenu: `L'accès aux services de la Plateforme nécessite la création d'un compte agence. Chaque inscription est soumise à une validation manuelle par l'équipe de Réseaux Immo afin de garantir le caractère professionnel des membres du réseau.

L'utilisateur s'engage à fournir des informations exactes, complètes et à jour concernant son agence (coordonnées, bureaux, informations légales).

L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les actions effectuées depuis son compte. En cas de suspicion d'utilisation non autorisée, l'utilisateur doit immédiatement contacter Réseaux Immo.

Réseaux Immo se réserve le droit de refuser, suspendre ou supprimer tout compte en cas de violation des présentes CGV.`
  },
  {
    titre: "4. Tarifs et conditions de paiement",
    contenu: `**Abonnement Agence Partenaire** : 299€ HTVA par mois. Cet abonnement unique donne accès à l'ensemble des fonctionnalités de la Plateforme, sans frais supplémentaire.

L'abonnement est sans engagement de durée et peut être résilié à tout moment.

Dans un premier temps, la facturation des abonnements est gérée directement par l'équipe de Réseaux Immo, en dehors de la Plateforme. Les modalités de paiement sont communiquées à l'agence lors de la validation de son inscription.

**Commissions entre agences** : Réseaux Immo ne prélève aucune commission sur les transactions conclues entre agences. Le taux de commission rétrocédé à l'agence apporteuse d'un acheteur est fixé librement par l'agence détentrice du mandat et affiché sur chaque bien.`
  },
  {
    titre: "5. Résiliation",
    contenu: `L'abonnement Agence Partenaire peut être résilié à tout moment. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement partiel n'est effectué pour la période entamée.

À la résiliation, l'agence perd l'accès au catalogue du réseau et ses biens ne sont plus visibles par les autres agences.

Réseaux Immo se réserve le droit de résilier l'abonnement d'une agence en cas de manquement aux présentes CGV ou de comportement préjudiciable au réseau.`
  },
  {
    titre: "6. Rôle des agences et déroulement d'une collaboration",
    contenu: `L'agence qui encode un bien sur la Plateforme est celle qui détient le mandat exclusif de vente : elle reste seule en contact avec le client vendeur et seule responsable de la vente.

L'agence qui apporte un acheteur potentiel se limite à transmettre les coordonnées de cet acheteur via la Plateforme. Elle ne dispose d'aucun mandat et n'intervient pas dans la relation avec le vendeur.

Réseaux Immo agit uniquement comme intermédiaire technique de mise en relation. La Plateforme n'est pas partie aux accords conclus entre agences et ne peut être tenue responsable de leur bonne exécution, notamment du versement effectif des commissions d'apport.`
  },
  {
    titre: "7. Protection des données",
    contenu: `Les données personnelles des utilisateurs et de leurs clients sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi belge du 30 juillet 2018.

Réseaux Immo s'engage à ne jamais vendre ni céder les données personnelles de ses utilisateurs à des tiers.

Les agences s'engagent à traiter les coordonnées des acheteurs et des vendeurs auxquelles elles accèdent dans le strict respect du RGPD, et exclusivement dans le cadre de la collaboration immobilière concernée.`
  },
  {
    titre: "8. Obligations et responsabilités des utilisateurs",
    contenu: `L'utilisateur s'engage à :
- Utiliser la Plateforme exclusivement à des fins professionnelles légales
- Fournir des informations exactes et véridiques dans les fiches de biens
- N'encoder que des biens pour lesquels il détient un mandat valide
- Ne pas tenter de contourner les systèmes de sécurité de la Plateforme
- Respecter la confidentialité des informations auxquelles il accède
- Ne pas reproduire, diffuser ou revendre les informations obtenues via la Plateforme

Réseaux Immo ne peut être tenu responsable des transactions conclues entre agences, ni de la véracité des informations fournies par les utilisateurs.`
  },
  {
    titre: "9. Propriété intellectuelle",
    contenu: `L'ensemble des éléments constituant la Plateforme (design, textes, logos, fonctionnalités, code source) est la propriété exclusive de Réseaux Immo et est protégé par les lois belges et internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification ou exploitation de ces éléments sans autorisation expresse est strictement interdite.`
  },
  {
    titre: "10. Limitation de responsabilité",
    contenu: `Réseaux Immo met tout en œuvre pour assurer la disponibilité et le bon fonctionnement de la Plateforme, mais ne peut garantir une disponibilité ininterrompue.

Réseaux Immo ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme, des informations qui y sont publiées, ou des transactions conclues entre agences.

La responsabilité de Réseaux Immo est limitée au montant des sommes effectivement perçues auprès de l'agence concernée au cours des 12 derniers mois.`
  },
  {
    titre: "11. Modification des CGV",
    contenu: `Réseaux Immo se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés de toute modification substantielle par email. La poursuite de l'utilisation de la Plateforme après notification vaut acceptation des nouvelles CGV.`
  },
  {
    titre: "12. Droit applicable et juridiction compétente",
    contenu: `Les présentes CGV sont soumises au droit belge. En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGV, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux de Bruxelles seront seuls compétents.

Pour toute question relative aux présentes CGV, vous pouvez nous contacter à : contact@reseaux-immo.be`
  },
];

export default function CGVPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <style>{`
        @media (max-width: 768px) {
          .cgv-hero { padding: 130px 24px 56px !important; }
          .cgv-hero h1 { font-size: 30px !important; }
          .cgv-content { padding: 48px 20px !important; }
        }
      `}</style>

      <PublicNav />

      {/* Hero */}
      <div className="cgv-hero" style={{ background: "#001B38", padding: "160px 48px 72px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#FF9500", letterSpacing: "0.1em", margin: "0 0 14px" }}>LÉGAL</p>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
          Conditions générales de vente
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Dernière mise à jour : janvier 2026
        </p>
      </div>

      <div className="cgv-content" style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px" }}>

        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#002B54", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
              {section.titre}
            </h2>
            <div style={{ fontSize: 14, color: "#5A6B7D", lineHeight: 1.9 }}>
              {section.contenu.split('\n').map((line, j) => (
                line.trim() === '' ? (
                  <br key={j} />
                ) : line.startsWith('**') && line.endsWith('**') ? (
                  <p key={j} style={{ fontWeight: 700, color: "#002B54", margin: "12px 0 4px" }}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ) : line.startsWith('- ') ? (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "4px 0" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 4 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{line.replace('- ', '')}</span>
                  </div>
                ) : (
                  <p key={j} style={{ margin: "0 0 8px" }}>{line}</p>
                )
              ))}
            </div>
            {i < sections.length - 1 && <div style={{ height: 1, background: "#F0F3F7", marginTop: 48 }} />}
          </div>
        ))}

        <div style={{ background: "#FAFDFD", borderRadius: 16, border: "1px solid #E8EDF2", padding: "32px", textAlign: "center", marginTop: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#002B54", margin: "0 0 8px" }}>Une question sur nos CGV ?</p>
          <p style={{ fontSize: 13, color: "#5A6B7D", margin: "0 0 20px" }}>Notre équipe est disponible pour répondre à vos questions.</p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FF9500", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Nous contacter →
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}