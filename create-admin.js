// Script utilitaire pour créer un compte admin
// Usage : node create-admin.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // ⬇️ Modifie ces 2 valeurs si besoin
  const email = "admin@immoreseaux.popmyfig.com";
  const password = "Admin1234!";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Si le compte existe déjà, on met à jour son rôle + mot de passe
    const hash = await bcrypt.hash(password, 10);
    const updated = await prisma.user.update({
      where: { email },
      data: {
        password: hash,
        role: "ADMIN",
      },
    });
    console.log(`✅ Compte existant mis à jour en ADMIN : ${updated.email}`);
    console.log(`   Mot de passe : ${password}`);
  } else {
    // Création d'un nouveau compte admin sans agence rattachée
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hash,
        role: "ADMIN",
      },
    });
    console.log(`✅ Compte admin créé : ${admin.email}`);
    console.log(`   Mot de passe : ${password}`);
  }
}

main()
  .catch((e) => console.error("❌", e))
  .finally(() => prisma.$disconnect());