import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name requires 2 characters")
    .max(100, { message: "Name must be under 100 characters" }),
  slug: z
    .string()
    .trim()
    .min(2, "Name requires 2 characters")
    .max(100, { message: "Name must be under 100 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  icon: z
    .string()
    .trim()
    .min(1, { message: "Icon name is required" })
    .max(100, { message: "Icon name must be under 100 characters" }),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional()
    .nullable(),
  parentId: z.string().trim().optional().nullable(),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name requires 2 characters")
    .max(100, { message: "Name must be under 100 characters" })
    .optional()
    .nullable(),
  slug: z
    .string()
    .trim()
    .min(2, "Name requires 2 characters")
    .max(100, { message: "Name must be under 100 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    })
    .optional()
    .nullable(),
  icon: z
    .string()
    .trim()
    .min(1, { message: "Icon name is required" })
    .max(100, { message: "Icon name must be under 100 characters" })
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description must be under 5000 characters" })
    .optional()
    .nullable(),
  parentId: z.string().trim().optional().nullable(),
});

export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>;
