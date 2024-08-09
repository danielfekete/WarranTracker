import React from "react";

interface Props {
  message: string;
}

export default function FormErrorMessage({ message }: Props) {
  return <div className="text-red-500">{message}</div>;
}
