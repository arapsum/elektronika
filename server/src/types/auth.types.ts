import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.email({ message: "invalid e-mail address" }),
    name: z
      .string()
      .min(2, { message: "name requires 2 letters" })
      .max(100, { message: "name must be under 100 letters!" }),
    password: z
      .string()
      .min(8, { message: "password requires 8 characters" })
      .max(48, { message: "password must be under 48 characters" }),
    confirmPassword: z.string().min(1, {
      message: "confirm password is required",
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "passwords failed to match",
  });

export type SignUpType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email({ message: "invalid e-mail address" }),
  password: z
    .string()
    .min(8, { message: "password requires 8 characters" })
    .max(48, { message: "password must be under 48 characters" }),
});

export type SignInType = z.infer<typeof SignInSchema>;
