import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendDeblocageConfirme } from "@/lib/emails";

// Lazy init — Stripe n'est créé qu'à l'appel de la route, pas au build
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe non configuré");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("Webhook error:", e.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode === "subscription") {
          const customerId = session.customer;
          const acheteur = await prisma.acheteur.findFirst({
            where: { stripeCustomerId: customerId },
          });
          if (acheteur) {
            await prisma.acheteur.update({
              where: { id: acheteur.id },
              data: {
                stripeSubId: session.subscription,
                subStatus: "active",
              },
            });
          }
        }

        if (session.mode === "payment") {
          const acheteurId = session.metadata?.acheteurId;
          const opportuniteId = session.metadata?.opportuniteId;
          const packCommission = session.metadata?.packCommission ? parseInt(session.metadata.packCommission) : null;

          if (acheteurId && opportuniteId) {
            const deblocage = await prisma.deblocage.upsert({
              where: { acheteurId_opportuniteId: { acheteurId, opportuniteId } },
              create: {
                acheteurId,
                opportuniteId,
                stripePaymentId: session.payment_intent,
                paidAt: new Date(),
                packCommission,
              },
              update: {
                stripePaymentId: session.payment_intent,
                paidAt: new Date(),
                packCommission,
              },
            });

            // Créer conversation automatiquement
            await prisma.conversation.upsert({
              where: { deblocageId: deblocage.id },
              create: { deblocageId: deblocage.id },
              update: {},
            });

            // Email confirmation déblocage
            try {
              const acheteur = await prisma.acheteur.findUnique({
                where: { id: acheteurId },
                include: { user: { select: { email: true } } },
              });
              const opportunite = await prisma.opportunite.findUnique({
                where: { id: opportuniteId },
              });
              if (acheteur && opportunite) {
                await sendDeblocageConfirme(acheteur.user.email, opportunite, packCommission);
              }
            } catch (emailError) {
              console.error("Erreur email déblocage:", emailError);
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const acheteur = await prisma.acheteur.findFirst({
          where: { stripeSubId: subscription.id },
        });
        if (acheteur) {
          await prisma.acheteur.update({
            where: { id: acheteur.id },
            data: { subStatus: "canceled" },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const acheteur = await prisma.acheteur.findFirst({
          where: { stripeCustomerId: invoice.customer },
        });
        if (acheteur) {
          await prisma.acheteur.update({
            where: { id: acheteur.id },
            data: { subStatus: "past_due" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook processing error:", e);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }
}