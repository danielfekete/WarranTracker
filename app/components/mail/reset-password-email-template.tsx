import React from "react";

interface Props {
  token: string;
}

export default function ResetPasswordEmailTemplate({ token }: Props) {
  return (
    <div>
      <p>
        Click{" "}
        <a href={`http://localhost:3000/auth/new-password?token=${token}`}>
          here
        </a>{" "}
        to change your password.
      </p>
    </div>
  );
}
