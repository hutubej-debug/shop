import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed Stores
  const stores = await Promise.all([
    prisma.store.upsert({
      where: { code: 'REWE' },
      update: {},
      create: { name: 'Rewe', code: 'REWE' },
    }),
    prisma.store.upsert({
      where: { code: 'ALDI' },
      update: {},
      create: { name: 'Aldi', code: 'ALDI' },
    }),
    prisma.store.upsert({
      where: { code: 'LIDL' },
      update: {},
      create: { name: 'Lidl', code: 'LIDL' },
    }),
    prisma.store.upsert({
      where: { code: 'PENNY' },
      update: {},
      create: { name: 'Penny', code: 'PENNY' },
    }),
    prisma.store.upsert({
      where: { code: 'DM' },
      update: {},
      create: { name: 'DM', code: 'DM' },
    }),
    prisma.store.upsert({
      where: { code: 'KARADAG' },
      update: {},
      create: { name: 'Karadag', code: 'KARADAG' },
    }),
  ]);
  console.log('✅ Stores seeded:', stores.length);

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Dairy' },
      update: {},
      create: { name: 'Dairy' },
    }),
    prisma.category.upsert({
      where: { name: 'Meat' },
      update: {},
      create: { name: 'Meat' },
    }),
    prisma.category.upsert({
      where: { name: 'Vegetables' },
      update: {},
      create: { name: 'Vegetables' },
    }),
    prisma.category.upsert({
      where: { name: 'Fruits' },
      update: {},
      create: { name: 'Fruits' },
    }),
    prisma.category.upsert({
      where: { name: 'Household' },
      update: {},
      create: { name: 'Household' },
    }),
    prisma.category.upsert({
      where: { name: 'Beverages' },
      update: {},
      create: { name: 'Beverages' },
    }),
    prisma.category.upsert({
      where: { name: 'Bakery' },
      update: {},
      create: { name: 'Bakery' },
    }),
    prisma.category.upsert({
      where: { name: 'Frozen' },
      update: {},
      create: { name: 'Frozen' },
    }),
  ]);
  console.log('✅ Categories seeded:', categories.length);

  console.log('✨ Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
