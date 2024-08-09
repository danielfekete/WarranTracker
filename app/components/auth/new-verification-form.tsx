"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import {
  newVerification,
  NewVerificationState,
} from "../../lib/actions/new-verification";
import FormErrorMessage from "./form-error-message";
import FormSuccessMessage from "./form-success-message";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, dispatch] = useFormState<NewVerificationState>(
    newVerification.bind(null, {
      token,
    }),
    {
      error: "",
      success: "",
    }
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, [formRef]);

  return (
    <div>
      {!state.error && !state.success ? <div>Loading...</div> : null}
      {state.error ? <FormErrorMessage message={state.error} /> : null}
      {state.success ? <FormSuccessMessage message={state.success} /> : null}
      <form action={dispatch} />
    </div>
  );
}
