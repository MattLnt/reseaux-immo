import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@immoreseaux.popmyfig.com";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Wrapper avec gestion d'erreur — on log mais on ne bloque jamais le flux
async function sendEmail({ to, subject, html }) {
  try {
    const res = await resend.emails.send({
      from: `Réseaux Immo <${FROM}>`,
      to,
      subject,
      html,
    });
    if (res.error) {
      console.error("[EMAIL] Resend error:", res.error);
      return { ok: false, error: res.error };
    }
    console.log(`[EMAIL] Sent to ${to} — ${subject}`);
    return { ok: true, id: res.data?.id };
  } catch (err) {
    console.error("[EMAIL] Exception:", err);
    return { ok: false, error: err.message };
  }
}

// ─────────────────────────────────────────
// 1. EMAIL — Agence : inscription reçue, en attente de validation
// ─────────────────────────────────────────
export async function sendAgenceEnAttente({ to, nomAgence }) {
  await sendEmail({
    to,
    subject: "Votre inscription est en attente de validation",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#001B38;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Réseaux <span style="color:#FF9500;">Immo</span></span></td>
              <td align="right"><span style="background:rgba(255,149,0,0.15);color:#FF9500;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">EN ATTENTE</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#002B54;padding:48px 40px 40px;">
            <div style="width:56px;height:56px;background:rgba(255,149,0,0.15);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:20px;">⏳</div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;line-height:1.2;">Inscription bien<br><span style="color:#FF9500;">reçue</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Bonjour <strong style="color:#ffffff;">${nomAgence}</strong>, nous avons bien reçu votre demande d'inscription sur la plateforme Réseaux Immo. Votre compte est actuellement en cours d'examen par notre équipe.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 28px;">PROCHAINES ÉTAPES</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:0 0 20px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#001B38;border-radius:8px;text-align:center;line-height:32px;color:#FF9500;font-size:12px;font-weight:700;">01</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 4px;">Vérification de votre dossier</p>
                    <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Notre équipe administrative vérifie les informations transmises lors de votre inscription.</p>
                  </td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:0 0 20px;border-top:1px solid #F0F3F7;">
                <table cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#001B38;border-radius:8px;text-align:center;line-height:32px;color:#FF9500;font-size:12px;font-weight:700;">02</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 4px;">Validation de votre accès</p>
                    <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Une fois validé, vous recevrez un email de confirmation et pourrez accéder à votre espace.</p>
                  </td>
                </tr></table>
              </td></tr>
              <tr><td style="border-top:1px solid #F0F3F7;">
                <table cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
                  <td style="vertical-align:top;padding-right:16px;">
                    <div style="width:32px;height:32px;background:#001B38;border-radius:8px;text-align:center;line-height:32px;color:#FF9500;font-size:12px;font-weight:700;">03</div>
                  </td>
                  <td>
                    <p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 4px;">Accès au réseau</p>
                    <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Encodez vos biens, consultez le catalogue inter-agences et démarrez le co-courtage.</p>
                  </td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#FAFDFD;padding:28px 40px;border-top:1px solid #E8EDF2;">
            <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Le délai de validation est généralement de quelques heures ouvrées. Merci pour votre patience.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#001B38;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Réseaux Immo — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF9500;font-size:12px;text-decoration:none;">reseaux-immo.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}

// ─────────────────────────────────────────
// 2. EMAIL — Agence : compte validé 🎉
// ─────────────────────────────────────────
export async function sendAgenceValidee({ to, nomAgence }) {
  await sendEmail({
    to,
    subject: "Votre compte Réseaux Immo est activé",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#001B38;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Réseaux <span style="color:#FF9500;">Immo</span></span></td>
              <td align="right"><span style="background:rgba(16,185,129,0.15);color:#10B981;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">COMPTE ACTIVÉ</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#002B54;padding:48px 40px 40px;">
            <div style="width:56px;height:56px;background:rgba(16,185,129,0.15);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:20px;">✓</div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;line-height:1.2;">Votre compte est<br><span style="color:#FF9500;">activé</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 32px;">Bonjour <strong style="color:#ffffff;">${nomAgence}</strong>, votre accès à la plateforme Réseaux Immo est désormais ouvert. Vous pouvez vous connecter et commencer à utiliser toutes les fonctionnalités.</p>
            <a href="${BASE_URL}/login" style="display:inline-block;background:#FF9500;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Se connecter à mon espace →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 28px;">CE QUE VOUS POUVEZ FAIRE</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:0 0 18px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🏠</td>
                  <td><p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 3px;">Encoder vos biens</p><p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Publiez vos biens en quelques minutes avec votre commission et le pourcentage que vous partagez.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:18px 0;border-top:1px solid #F0F3F7;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🔍</td>
                  <td><p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 3px;">Consulter le catalogue</p><p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Découvrez tous les biens publiés par les autres agences du réseau et trouvez des opportunités pour vos acheteurs.</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:18px 0 0;border-top:1px solid #F0F3F7;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:top;padding-right:14px;font-size:20px;width:36px;">🤝</td>
                  <td><p style="font-size:14px;font-weight:700;color:#002B54;margin:0 0 3px;">Co-courtage simplifié</p><p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Mettez vos acheteurs en relation avec les agences détentrices et touchez votre part de commission.</p></td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#FAFDFD;padding:28px 40px;border-top:1px solid #E8EDF2;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="font-size:14px;font-weight:600;color:#002B54;margin:0 0 4px;">Prêt à démarrer ?</p>
                <p style="font-size:13px;color:#5A6B7D;margin:0;">Connectez-vous et encodez votre premier bien.</p>
              </td>
              <td align="right">
                <a href="${BASE_URL}/login" style="display:inline-block;background:#001B38;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Mon espace →</a>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#001B38;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Réseaux Immo — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF9500;font-size:12px;text-decoration:none;">reseaux-immo.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}

// ─────────────────────────────────────────
// 3. EMAIL — Agence : compte désactivé
// ─────────────────────────────────────────
export async function sendAgenceDesactivee({ to, nomAgence }) {
  await sendEmail({
    to,
    subject: "Votre compte Réseaux Immo a été désactivé",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#001B38;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Réseaux <span style="color:#FF9500;">Immo</span></span></td>
              <td align="right"><span style="background:rgba(156,163,175,0.18);color:#9CA3AF;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">DÉSACTIVÉ</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#002B54;padding:48px 40px 40px;">
            <div style="width:56px;height:56px;background:rgba(156,163,175,0.18);border-radius:16px;text-align:center;line-height:56px;font-size:24px;margin-bottom:20px;">🔒</div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;line-height:1.2;">Compte<br><span style="color:#FF9500;">désactivé</span></h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Bonjour <strong style="color:#ffffff;">${nomAgence}</strong>, nous vous informons que votre compte Réseaux Immo a été désactivé. Vous n'avez plus accès à la plateforme.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <div style="background:#FAFDFD;border-radius:12px;padding:24px;border:1px solid #E8EDF2;margin-bottom:24px;">
              <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">VOUS PENSEZ QU'IL S'AGIT D'UNE ERREUR ?</p>
              <p style="font-size:14px;color:#002B54;margin:0 0 8px;font-weight:600;">Contactez-nous</p>
              <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Notre équipe peut vérifier votre dossier et réactiver votre compte si nécessaire. Nous vous répondrons rapidement.</p>
            </div>
            <p style="font-size:13px;color:#5A6B7D;margin:0;line-height:1.6;">Merci pour la confiance que vous nous avez accordée pendant la durée de votre utilisation de la plateforme.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#001B38;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">© 2026 Réseaux Immo — Belgique</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF9500;font-size:12px;text-decoration:none;">reseaux-immo.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}

// ─────────────────────────────────────────
// 4. EMAIL — Admin : nouvelle inscription à valider
// ─────────────────────────────────────────
export async function sendAdminNouvelleInscription({ nomAgence, emailAgence, telephoneAgence, adresseAgence }) {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle inscription à valider — ${nomAgence}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#001B38;border-radius:16px 16px 0 0;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Réseaux <span style="color:#FF9500;">Immo</span></span></td>
              <td align="right"><span style="background:rgba(239,68,68,0.15);color:#EF4444;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.05em;">ADMIN — ACTION REQUISE</span></td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="background:#002B54;padding:48px 40px 40px;">
            <div style="display:inline-block;background:rgba(255,149,0,0.15);color:#FF9500;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:20px;letter-spacing:0.05em;">NOUVELLE INSCRIPTION</div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;line-height:1.2;">Une nouvelle agence<br>attend votre validation</h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0;">Consultez les informations ci-dessous et activez le compte depuis votre tableau de bord administrateur.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">INFORMATIONS DE L'AGENCE</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F0F3F7;border-radius:12px;overflow:hidden;">
              <tr style="background:#FAFDFD;">
                <td style="padding:14px 20px;color:#5A6B7D;font-size:13px;border-bottom:1px solid #F0F3F7;width:140px;">Nom de l'agence</td>
                <td style="padding:14px 20px;color:#002B54;font-weight:700;font-size:14px;text-align:right;border-bottom:1px solid #F0F3F7;">${nomAgence}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#5A6B7D;font-size:13px;border-bottom:1px solid #F0F3F7;">Email</td>
                <td style="padding:14px 20px;color:#FF9500;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F0F3F7;"><a href="mailto:${emailAgence}" style="color:#FF9500;text-decoration:none;">${emailAgence}</a></td>
              </tr>
              <tr style="background:#FAFDFD;">
                <td style="padding:14px 20px;color:#5A6B7D;font-size:13px;border-bottom:1px solid #F0F3F7;">Téléphone</td>
                <td style="padding:14px 20px;color:#002B54;font-weight:700;font-size:13px;text-align:right;border-bottom:1px solid #F0F3F7;">${telephoneAgence || "—"}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#5A6B7D;font-size:13px;">Adresse</td>
                <td style="padding:14px 20px;color:#002B54;font-weight:700;font-size:13px;text-align:right;">${adresseAgence || "—"}</td>
              </tr>
            </table>

            <div style="background:rgba(255,149,0,0.06);border-radius:10px;padding:16px 20px;margin:24px 0;border-left:3px solid #FF9500;">
              <p style="font-size:13px;color:#002B54;margin:0;line-height:1.6;"><strong>⚡ Action requise :</strong> tant que vous ne validez pas l'inscription, l'agence ne peut pas se connecter à la plateforme.</p>
            </div>

            <a href="${BASE_URL}/dashboard/admin/agences" style="display:inline-block;background:#001B38;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Accéder à l'administration →</a>
          </td>
        </tr>

        <tr>
          <td style="background:#001B38;border-radius:0 0 16px 16px;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><p style="color:#6B7280;font-size:12px;margin:0;">Notification administrative — Réseaux Immo</p></td>
              <td align="right"><a href="${BASE_URL}" style="color:#FF9500;font-size:12px;text-decoration:none;">reseaux-immo.vercel.app</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}