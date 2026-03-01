import db from "@/db/index.ts";
import { category, type CategoryInsertModel } from "@/db/schema/categories.ts";

const coreCategories: CategoryInsertModel[] = [
	{ name: "Electronics", slug: "electronics", icon: "FaMicroChip" },
	{ name: "Computers", slug: "computers", icon: "FaComputer" },
	{ name: "Phones", slug: "phones", icon: "BsPhone" },
];

async function seedCoreCategories(categories: CategoryInsertModel[]) {
	try {
		await db.insert(category).values(categories);

		console.log("Seeding core categories succeeded!");
	} catch (e) {
		console.log("Error seeding core categories model: ", e);

		throw e;
	}
}

if (import.meta.filename) {
	await seedCoreCategories(coreCategories);

	process.exit(0);
}
