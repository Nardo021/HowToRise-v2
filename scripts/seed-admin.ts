import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { hashPassword } from "../src/server/auth/password";

async function main() {
  const email = process.env.ADMIN_DEFAULT_EMAIL ?? "admin@howtorise.net";
  const password = process.env.ADMIN_DEFAULT_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await hashPassword(password);
  await prisma.admin.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash }
  });
  console.log(`Seeded admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
