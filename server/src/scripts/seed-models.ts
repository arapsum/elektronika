import db from "@/db/index.ts";
import { attributeType, brand, category } from "@/db/schema/index.ts";
import type {
  CategoryInsertModel,
  BrandInsertModel,
  AttributeTypeInsertModel,
} from "@/db/schema/index.ts";

const coreCategories: CategoryInsertModel[] = [
  { name: "Electronics", slug: "electronics", icon: "FaMicroChip" },
  { name: "Computers", slug: "computers", icon: "FaComputer" },
  { name: "Phones", slug: "phones", icon: "BsPhone" },
];

const coreAttributes: AttributeTypeInsertModel[] = [
  { name: "colour", description: "Primary colour of the product variant" },
  { name: "storage", description: "Physical storage capacity" },
  { name: "weight", description: "The total mass of the product" },
  { name: "ram", description: "Installed RAM capacity" },
  { name: "screen size", description: "Display size in inches" },
];

const coreBrands: BrandInsertModel[] = [
  {
    name: "Samsung",
    slug: "samsung",
    logoUrl: "https://cdn.example.com/brands/samsung.png",
  },
  {
    name: "Apple",
    slug: "apple",
    logoUrl: "https://cdn.example.com/brands/apple.png",
  },
  {
    name: "Google",
    slug: "google",
    logoUrl: "https://cdn.example.com/brands/google.png",
  },
  {
    name: "Huawei",
    slug: "huawei",
    logoUrl: "https://cdn.example.com/brands/huawei.png",
  },
  {
    name: "Xiaomi",
    slug: "xiaomi",
    logoUrl: "https://cdn.example.com/brands/xiaomi.png",
  },
];

async function seedCoreCategories(categories: CategoryInsertModel[]) {
  try {
    await db.insert(category).values(categories).onConflictDoNothing();

    console.log("Seeding core categories succeeded!");
  } catch (e) {
    console.log("Error seeding core categories model: ", e);

    throw e;
  }
}

async function seedCoreBrands(brands: BrandInsertModel[]) {
  try {
    await db.insert(brand).values(brands).onConflictDoNothing();

    console.log("Seeding core brands succeeded!");
  } catch (e) {
    console.log("Error seeding core brands model: ", e);

    throw e;
  }
}

async function seedCoreAttributeTypes(attributeTypes: AttributeTypeInsertModel[]) {
  try {
    await db.insert(attributeType).values(attributeTypes).onConflictDoNothing();

    console.log("Seeding core attribute types succeeded!");
  } catch (e) {
    console.log("Error seeding core attribute types model: ", e);

    throw e;
  }
}

if (import.meta.filename) {
  await Promise.all([
    seedCoreCategories(coreCategories),
    seedCoreBrands(coreBrands),
    seedCoreAttributeTypes(coreAttributes),
  ]);

  process.exit(0);
}
