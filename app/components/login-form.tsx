"use client";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useFormState } from "react-dom";
import login from "../lib/actions/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorMessage from "./form-error-message";
import FormIssues from "./form-issues";
import { useRef } from "react";

export default function LoginForm() {
  const [state, dispatch] = useFormState(login, {
    message: "",
  });

  const methods = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(state?.fields ?? {}),
    },
  });

  const { handleSubmit, control } = methods;

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...methods}>
      {state?.message !== "" && !state.issues ? (
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
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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
