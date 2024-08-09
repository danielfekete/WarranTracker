import React from "react";

interface Props {
  token: string;
}

export default function VerificationEmailTemplate({ token }: Props) {
  return (
    <div>
      <p>
        Click{" "}
        <a href={`http://localhost:3000/auth/new-verification?token=${token}`}>
          here
        </a>{" "}
        to confirm your email.
      </p>
    </div>
  );
}
