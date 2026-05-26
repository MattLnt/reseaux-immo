import { prisma } from './prisma.js'

async function main() {
  const plans = [
    {
      name: 'Basic',
      stripePriceId: process.env.STRIPE_PRICE_BASIC,
      price: 2900,
      jobLimit: 0,
      canAccessCandidates: false,
      canFeatureJobs: false,
    },
    {
      name: 'Superior',
      stripePriceId: process.env.STRIPE_PRICE_SUPERIOR,
      price: 19900,
      jobLimit: 1,
      canAccessCandidates: false,
      canFeatureJobs: false,
    },
    {
      name: 'Premium',
      stripePriceId: process.env.STRIPE_PRICE_PREMIUM,
      price: 49900,
      jobLimit: 1,
      canAccessCandidates: true,
      canFeatureJobs: true,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    })
    console.log(`✓ Plan ${plan.name} créé`)
  }

  console.log('✅ Plans insérés en base')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())