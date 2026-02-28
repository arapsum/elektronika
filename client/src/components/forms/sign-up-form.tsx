import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { baseAuthClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters.")
      .max(32, "Name must be at most 32 characters."),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32, "Bug title must be at most 32 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password!."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match!",
  });

export type FormData = z.infer<typeof formSchema>;

export default function SignupForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await baseAuthClient.signUp.email({ ...value });

      if (error) {
        toast.error(error.message, {
          id: "sign-up-error",
          duration: 5000,
        });

        return;
      }

      toast.success(`Welcome aboard user ${data.user.name}`, {
        id: "sign-up-success",
        duration: 5000,
      });
    },
  });

  const signInGoogle = async () => {
    const { error } = await baseAuthClient.signIn.social({
      provider: "google",
      // TODO: Use Environmental Variables
      callbackURL: "http://localhost:4321",
    });

    if (error) {
      toast.error(error.message, {
        id: "sign-up-error",
        duration: 5000,
      });

      return;
    }

    toast.success(`Welcome aboard`, {
      id: "sign-up-success",
      duration: 5000,
    });
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="capitalize text-xl">Get started now</CardTitle>
        <CardDescription>Fill in the form to create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-email-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="John Doe"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>E-mail Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="m@example.com"
                      type="email"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type="password"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="********"
                      type="password"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 md:gap-6">
        <Field orientation="vertical">
          <Button type="submit" form="sign-up-email-form" className="w-full h-14">
            Sign up
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            className="flex items-center gap-2 h-14"
            type="button"
            variant="outline"
            onClick={signInGoogle}
          >
            <FcGoogle className="size-4" />
            <span>Sign up with Google</span>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
