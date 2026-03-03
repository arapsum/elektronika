ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_price_unique";--> statement-breakpoint
CREATE INDEX "attribute_type_name_index" ON "attribute_type" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_brand_id_index" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_category_id_index" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_attributes_product_variant_id_index" ON "product_attributes" USING btree ("product_variant_id");--> statement-breakpoint
CREATE INDEX "product_attributes_attribute_type_id_index" ON "product_attributes" USING btree ("attribute_type_id");--> statement-breakpoint
CREATE INDEX "product_images_product_variant_id_index" ON "product_images" USING btree ("product_variant_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_index" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_sku_index" ON "product_variants" USING btree ("sku");