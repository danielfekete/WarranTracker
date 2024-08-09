"use client";
import React, { useRef } from "react";
import { useFormState } from "react-dom";
import { Form, useForm } from "react-hook-form";
import FormErrorMessage from "./form-error-message";
import FormIssues from "./form-issues";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/app/schemas/reset-password";
import { z } from "zod";
import {
  resetPassword,
  ResetPasswordState,
} from "@/app/lib/actions/reset-password";

export default function ResetPasswordForm() {
  const [state, dispatch] = useFormState<ResetPasswordState>(resetPassword, {
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const methods = useForm<z.infer<typeof resetPasswordSchema>>({
    mode: "onBlur",
    defaultValues: {
      email: state.field || "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const { control, handleSubmit } = methods;

  return (
    <Form {...methods}>
      {state?.message && !state?.issues ? (
        <FormErrorMessage message={state.message} />
      ) : null}
      {state?.issues ? <FormIssues issues={state.issues} /> : null}
      <form
        ref={formRef}
        noValidate
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit(() => {
            dispatch(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <div>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
