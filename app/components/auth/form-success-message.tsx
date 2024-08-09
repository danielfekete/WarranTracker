import React from "react";

interface Props {
  message: string;
}

export default function FormSuccessMessage({ message }: Props) {
  return <div className="text-green-500">{message}</div>;
}
