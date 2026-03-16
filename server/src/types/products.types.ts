import z from "zod";

export const ProductAttributeSchema = z.record(
  z
    .string()
    .trim()
    .min(1, { message: "Attribute name cannot be empty" })
    .max(100, { message: "Attribute name must be under 100 characters" })
    .toLowerCase(),
  z.string().trim(),
);

export type ProductAttributeType = z.infer<typeof ProductAttributeSchema>;

export const ProductSpecificationSchema = z.record(
  z.string().trim().min(1, { message: "Specification group name cannot be empty" }).max(100, {
    message: "Specification group name must be under 100 characters",
  }),
  z.record(
    z.string().trim().min(1, { message: "Specification name cannot be empty" }).max(100, {
      message: "Specification name must be under 100 characters",
    }),
    z.object({
      value: z.union([z.string().trim(), z.number(), z.boolean()]).transform(String),
      isKeySpec: z.boolean().default(false).optional(),
      icon: z.string().optional(),
      derivedFromAttribute: z.string().optional(),
    }),
  ),
);

export type ProductSpecificationType = z.infer<typeof ProductSpecificationSchema>;

export const ProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, { message: "SKU must be at least 3 characters long" })
    .max(100, { message: "SKU must be under 100 characters" })
    .regex(/^[A-Z0-9-_]+$/i, {
      message: "SKU can only contain letters, numbers, hyphens, and underscores",
    }),
  price: z
    .number()
    .positive({ message: "Price must be a positive number" })
    .multipleOf(0.01, {
      message: "Price can only have up to 2 decimal places",
    })
    .max(9999999.99, { message: "Price exceeds maximum allowed value" })
    .transform(String),
  isBase: z.boolean().default(false),
  quantity: z.coerce
    .number()
    .int({
      message: "Stock quantity must be an integer",
    })
    .nonnegative({ message: "Stock quantity cannot be negative" })
    .default(0),
  reorderThreshold: z.coerce
    .number()
    .int({
      message: "Reorder threshold must be an integer",
    })
    .nonnegative({ message: "Reorder threshold cannot be negative" })
    .default(0),
  attributes: ProductAttributeSchema.refine((attrs) => Object.keys(attrs).length > 0, {
    message: "At least one attribute is required",
  }),
});

export type ProductVariantType = z.infer<typeof ProductVariantSchema>;

export const ProductImageSchema = z.object({
  id: z.undefined().optional(),
  imageLink: z.url({ message: "Must be a valid URL" }),
  altText: z
    .string()
    .trim()
    .min(3, {
      message: "Alt text must be at least 3 characters for accessibility",
    })
    .max(255, { message: "Alt text must be under 255 characters" }),
  displayOrder: z.coerce
    .number()
    .int({
      message: "Display order must be an integer",
    })
    .positive({ message: "Display order must be a positive integer" }),
});

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be under 100 characters" }),
  // slug: z
  //   .string()
  //   .trim()
  //   .min(3, { message: "Slug must be at least 3 characters long" })
  //   .max(100, { message: "Slug must be under 100 characters" })
  //   .regex(/^[a-z0-9-]+$/, {
  //     message: "Slug can only contain lowercase letters, numbers, and hyphens",
  //   }),
  summary: z
    .string()
    .trim()
    .min(250, { message: "Summary must be at least 250 characters long" })
    .max(500, { message: "Summary must be under 500 characters" }),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional()
    .nullable(),
  categoryId: z
    .string()
    .min(1, { message: "Category ID is required" })
    .max(32, { message: "Category ID is invalid" }),
  brandId: z
    .string()
    .min(1, { message: "Brand ID is required" })
    .max(32, { message: "Brand ID is invalid" }),
  model: z.string().trim().max(100, { message: "Model number should be under 100 characters" }),
  images: z
    .array(ProductImageSchema)
    .min(1, { message: "At least one product image is required" })
    .max(10, { message: "Maximum 10 images allowed per variant" }),
  specifications: ProductSpecificationSchema.refine((specs) => Object.keys(specs).length > 0, {
    message: "Atleast provide one specification group",
  }),
  options: z.array(ProductVariantSchema).min(1, { message: "Atleast one option is required" }),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;

export const UpsertProductImageSchema = z
  .object({
    id: z.string().max(32, { message: "Invalid image ID " }).optional(),
    imageLink: z.url({ message: "Must be a valid URL" }).optional().nullable(),
    altText: z
      .string()
      .trim()
      .min(3, {
        message: "Alt text must be at least 3 characters for accessibility",
      })
      .max(255, { message: "Alt text must be under 255 characters" })
      .optional(),
    displayOrder: z.coerce
      .number()
      .int({
        message: "Display order must be an integer",
      })
      .positive({ message: "Display order must be a positive integer" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id) {
      if (!data.imageLink)
        ctx.addIssue({
          code: "custom",
          message: "imageLink is required when creating",
        });

      if (!data.altText)
        ctx.addIssue({
          code: "custom",
          message: "altText is required when creating",
        });

      if (!data.displayOrder)
        ctx.addIssue({
          code: "custom",
          message: "displayOrder is required when creating",
        });
    }
  });

export type UpsertProductImageType = z.infer<typeof UpsertProductImageSchema>;

export const UpdateProductGallerySchema = z.object({
  productId: z.string().max(32, { message: "Invalid product ID" }).optional(),
  imageLink: z.url({ message: "Must be a valid URL" }).optional().nullable(),
  altText: z.string().trim().optional().nullable(),
  displayOrder: z
    .number()
    .positive({ message: "Display order must be a positive number" })
    .optional()
    .nullable(),
});

export type UpdateProductGalleryType = z.infer<typeof UpdateProductGallerySchema>;

export const UpdateProductOptionSchema = z.object({
  productId: z.string().max(32, { message: "Invalid product ID" }).optional(),
  attributes: ProductAttributeSchema.optional(),
});

export type UpdateProductOptionType = z.infer<typeof UpdateProductOptionSchema>;

export const UpdateProductVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, { message: "SKU must be at least 3 characters long" })
    .max(100, { message: "SKU must be under 100 characters" })
    .regex(/^[A-Z0-9-_]+$/i, {
      message: "SKU can only contain letters, numbers, hyphens, and underscores",
    })
    .optional(),
  price: z
    .number()
    .positive({ message: "Price must be a positive number" })
    .multipleOf(0.01, {
      message: "Price can only have up to 2 decimal places",
    })
    .max(9999999.99, { message: "Price exceeds maximum allowed value" })
    .transform(String)
    .optional(),
  isBase: z.boolean().optional(),
  quantity: z.coerce
    .number()
    .int({
      message: "Stock quantity must be an integer",
    })
    .nonnegative({ message: "Stock quantity cannot be negative" })
    .optional(),
  reorderThreshold: z.coerce
    .number()
    .int({
      message: "Reorder threshold must be an integer",
    })
    .nonnegative({ message: "Reorder threshold cannot be negative" })
    .optional(),
});

export type UpdateProductVariantType = z.infer<typeof UpdateProductVariantSchema>;

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be under 100 characters" })
    .optional(),
  summary: z
    .string()
    .trim()
    .min(250, { message: "Summary must be at least 250 characters long" })
    .max(500, { message: "Summary must be under 500 characters" })
    .optional(),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional()
    .nullable(),
  categoryId: z
    .string()
    .min(1, { message: "Category ID is required" })
    .max(32, { message: "Category ID is invalid" })
    .optional(),
  brandId: z
    .string()
    .min(1, { message: "Brand ID is required" })
    .max(32, { message: "Brand ID is invalid" })
    .optional(),
  model: z
    .string()
    .trim()
    .max(100, { message: "Model number should be under 100 characters" })
    .optional(),
  specifications: ProductSpecificationSchema.optional(),
});

export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
