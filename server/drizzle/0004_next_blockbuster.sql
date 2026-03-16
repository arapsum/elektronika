ALTER TABLE "products" ALTER COLUMN "year" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "products_name_year_index" ON "products" USING btree ("name","year");