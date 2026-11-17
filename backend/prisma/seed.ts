
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // Countries
  const countries = [
    { code: "GLOBAL", name: "Global", currency: null },
    { code: "JP", name: "Japan", currency: "JPY" },
    { code: "US", name: "United States", currency: "USD" },
    { code: "UZ", name: "Uzbekistan", currency: "UZS" },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {
        name: country.name,
        currency: country.currency,
      },
      create: country,
    });
  }

  // Industries
  const industries = [
    { code: "ALL", name: "All Industries" },
    { code: "ECOMMERCE", name: "E-commerce" },
    { code: "EDUCATION", name: "Education" },
    { code: "FINANCE", name: "Finance" },
    { code: "FOOD", name: "Food & Beverage" },
    { code: "HEALTHCARE", name: "Healthcare" },
    { code: "REAL_ESTATE", name: "Real Estate" },
    { code: "TRAVEL", name: "Travel & Tourism" },
    { code: "SOFTWARE", name: "Software & IT" },
    { code: "RETAIL", name: "Retail" },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { code: industry.code },
      update: { name: industry.name },
      create: industry,
    });
  }

  // Advertising platforms
  const platforms = [
    { code: "ALL", name: "All Platforms" },
    { code: "GOOGLE_ADS", name: "Google Ads" },
    { code: "META_ADS", name: "Meta Ads" },
  ];

  for (const platform of platforms) {
    await prisma.adPlatform.upsert({
      where: { code: platform.code },
      update: { name: platform.name },
      create: platform,
    });
  }

  console.log("Countries:", countries.length);
  console.log("Industries:", industries.length);
  console.log("Platforms:", platforms.length);

  console.log("Database seeding completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
