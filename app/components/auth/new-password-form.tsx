"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { newPassword, NewPasswordState } from "@/app/lib/actions/new-password";
import { newPasswordSchema } from "@/app/schemas/new-password";
import { z } from "zod";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [state, dispatch] = useFormState<NewPasswordState>(
    newPassword.bind(null, {
      token,
    }),
    {
      message: "",
    }
  );

  const methods = useForm<z.infer<typeof newPasswordSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(newPasswordSchema),
    mode: "onBlur",
  });

  const { handleSubmit, control } = methods;

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...methods}>
      {state?.message && !state.issues ? (
        <FormErrorMessage message={state.message} />
      ) : null}
      {state?.issues ? <FormIssues issues={state.issues} /> : null}
      <form
        ref={formRef}
        action={dispatch}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
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
