import { auth } from "@/auth";
import React from "react";

export default async function Page() {
  const session = await auth();

  return <div>{JSON.stringify(session)}</div>;
}
