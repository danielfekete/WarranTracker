"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import register, { RegisterState } from "../../lib/actions/register";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "../../schemas/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormIssues from "./form-issues";
import FormErrorMessage from "./form-error-message";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {
  const [state, dispatch] = useFormState<RegisterState>(register, {
    message: "",
  });

  const methods = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      email: state?.fields?.email ?? "",
      confirmPassword: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
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
            name="email"
            render={({ field }) => (
              <FormItem>
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
