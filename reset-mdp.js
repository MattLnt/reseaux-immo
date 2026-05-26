const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'agence2@test.com';
  const nouveauMdp = 'Test1234!';

  const hash = await bcrypt.hash(nouveauMdp, 10);

  const user = await prisma.user.update({
    where: { email },
    data: { password: hash },
  });

  console.log(`✅ Mot de passe réinitialisé pour ${user.email}`);
  console.log(`   Nouveau mot de passe : ${nouveauMdp}`);
}

main()
  .catch((e) => console.error('❌', e))
  .finally(() => prisma.$disconnect());