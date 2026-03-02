import z from "zod";

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be under 100 characters" }),
  slug: z
    .string()
    .trim()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(100, { message: "Slug must be under 100 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
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
});

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be under 100 characters" })
    .optional()
    .nullable(),
  slug: z
    .string()
    .trim()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(100, { message: "Slug must be under 100 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    })
    .optional()
    .nullable(),
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
    .optional()
    .nullable(),
  brandId: z
    .string()
    .min(1, { message: "Brand ID is required" })
    .max(32, { message: "Brand ID is invalid" })
    .optional()
    .nullable(),
});

export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
