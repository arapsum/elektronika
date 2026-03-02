import z from "zod";

export const ProductAttributeSchema = z.record(
  z
    .string()
    .trim()
    .min(1, { message: "Attribute name cannot be empty" })
    .max(100, { message: "Attribute name must be under 100 characters" })
    .toLowerCase(),
  z.union([z.string().trim(), z.number(), z.boolean()]),
);

export type ProductAttributeType = z.infer<typeof ProductAttributeSchema>;

export const ProductImageSchema = z.object({
  imageUrl: z.url({ message: "Must be a valid URL" }),
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

export type ProductImageType = z.infer<typeof ProductImageSchema>;

export const UpdateProductImageSchema = z.object({
  id: z.coerce
    .number()
    .int({ message: "Image ID must be an integer" })
    .positive({ message: "Image ID must be a positive number" })
    .optional()
    .nullable(),
  imageUrl: z.url({ message: "Must be a valid URL" }).optional().nullable(),
  altText: z
    .string()
    .trim()
    .min(3, {
      message: "Alt text must be at least 3 characters for accessibility",
    })
    .max(255, { message: "Alt text must be under 255 characters" })
    .optional()
    .nullable(),
  displayOrder: z.coerce
    .number()
    .int({
      message: "Display order must be an integer",
    })
    .positive({ message: "Display order must be a positive integer" })
    .optional()
    .nullable(),
});

export type UpdateProductImageType = z.infer<typeof UpdateProductImageSchema>;

export const ProductImagesSchema = z.array(ProductImageSchema);

export const CreateProductVariantSchema = z.object({
  productId: z
    .string()
    .min(1, { message: "Product ID is required" })
    .max(32, { message: "Product ID is invalid" }),
  sku: z
    .string()
    .trim()
    .min(3, { message: "SKU must be at least 3 characters long" })
    .max(100, { message: "SKU must be under 100 characters" })
    .regex(/^[A-Z0-9-_]+$/i, {
      message: "SKU can only contain letters, numbers, hyphens, and underscores",
    }),
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(255, { message: "Name must be under 255 characters long" }),
  price: z
    .number()
    .positive({ message: "Price must be a positive number" })
    .multipleOf(0.01, { message: "Price can only have up to 2 decimal places" })
    .max(9999999.99, { message: "Price exceeds maximum allowed value" }),
  isBase: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional(),
  stockQuantity: z.coerce
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
  images: z
    .array(ProductImageSchema)
    .min(1, { message: "At least one product image is required" })
    .max(10, { message: "Maximum 10 images allowed per variant" }),
  attributes: ProductAttributeSchema.refine((attrs) => Object.keys(attrs).length > 0, {
    message: "At least one attribute is required",
  }),
});

export type CreateProductVariantType = z.infer<typeof CreateProductVariantSchema>;

export const UpdateProductVariantSchema = z.object({
  productId: z.coerce
    .number()
    .int({ message: "Product ID must be an integer" })
    .positive({ message: "Product ID must be a positive number" })
    .optional()
    .nullable(),
  sku: z
    .string()
    .trim()
    .min(3, { message: "SKU must be at least 3 characters long" })
    .max(100, { message: "SKU must be under 100 characters" })
    .regex(/^[A-Z0-9-_]+$/i, {
      message: "SKU can only contain letters, numbers, hyphens, and underscores",
    })
    .optional()
    .nullable(),
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(255, { message: "Name must be under 255 characters long" })
    .optional()
    .nullable(),
  price: z
    .number()
    .positive({ message: "Price must be a positive number" })
    .multipleOf(0.01, { message: "Price can only have up to 2 decimal places" })
    .max(9999999.99, { message: "Price exceeds maximum allowed value" })
    .optional()
    .nullable(),
  isBase: z.boolean().optional().nullable(),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional()
    .nullable(),
  stockQuantity: z.coerce
    .number()
    .int({
      message: "Stock quantity must be an integer",
    })
    .nonnegative({ message: "Stock quantity cannot be negative" })
    .optional()
    .nullable(),
  reorderThreshold: z.coerce
    .number()
    .int({
      message: "Reorder threshold must be an integer",
    })
    .nonnegative({ message: "Reorder threshold cannot be negative" })
    .optional()
    .nullable(),
  images: z
    .array(UpdateProductImageSchema)
    .max(10, { message: "Maximum 10 images allowed per variant" })
    .optional()
    .nullable(),
  attributes: ProductAttributeSchema.optional().nullable(),
});

export type UpdateProductVariantType = z.infer<typeof UpdateProductVariantSchema>;
export type ProductImagesType = z.infer<typeof ProductImagesSchema>;
