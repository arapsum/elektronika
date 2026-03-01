import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform(Number)
    .pipe(z.number().int().min(1).max(100)),
});

export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
