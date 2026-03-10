import db from "@/db/index.ts";
import { brandTable, categoryTable } from "@/db/schema/index.ts";
import type { CategoryInsertModel, BrandInsertModel } from "@/db/schema/index.ts";

const coreCategories: CategoryInsertModel[] = [
  {
    id: "j7dr27e60ppzuo1te9009qzg",
    name: "Electronics",
    slug: "electronics",
    icon: "FaMicroChip",
  },
  {
    id: "y4egmb1ku7wnk8dqqv8o0ark",
    name: "Computers & Tablets",
    slug: "computers-and-tablets",
    icon: "FaComputer",
    parentId: "j7dr27e60ppzuo1te9009qzg",
  },
  {
    id: "v4gmzomtay0cn178eiakvba3",
    name: "Laptops",
    slug: "laptops",
    icon: "IoIosLaptop",
    parentId: "y4egmb1ku7wnk8dqqv8o0ark",
  },

  {
    id: "v4gmzomtay0cn178eiakvba2",
    name: "Phones",
    slug: "phones",
    icon: "BsPhone",
    parentId: "j7dr27e60ppzuo1te9009qzg",
  },
  {
    id: "v4gnzomtay0cn178eiakvba9",
    name: "Smart Phones",
    slug: "smart-phones",
    icon: "SlScreenSmartphone",
    parentId: "v4gmzomtay0cn178eiakvba2",
  },
];

// const coreAttributes: AttributeTypeInsertModel[] = [
// 	{ name: "colour", description: "Primary colour of the product variant" },
// 	{ name: "storage", description: "Physical storage capacity" },
// 	{ name: "weight", description: "The total mass of the product" },
// 	{ name: "ram", description: "Installed RAM capacity" },
// 	{ name: "screen size", description: "Display size in inches" },
// ];

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
    await db.insert(categoryTable).values(categories).onConflictDoNothing();

    console.log("Seeding core categories succeeded!");
  } catch (e) {
    console.log("Error seeding core categories model: ", e);

    throw e;
  }
}

async function seedCoreBrands(brands: BrandInsertModel[]) {
  try {
    await db.insert(brandTable).values(brands).onConflictDoNothing();

    console.log("Seeding core brands succeeded!");
  } catch (e) {
    console.log("Error seeding core brands model: ", e);

    throw e;
  }
}

if (import.meta.filename) {
  await Promise.all([seedCoreCategories(coreCategories), seedCoreBrands(coreBrands)]);

  process.exit(0);
}
