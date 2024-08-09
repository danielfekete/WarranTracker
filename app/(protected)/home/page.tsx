import { auth, signOut } from "@/auth";
import React from "react";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </div>
    </div>
  );
}
