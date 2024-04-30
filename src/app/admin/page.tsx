// File: app/admin/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/server/db";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    redirect("/login");
  }

  const profile = await db.profile.findUnique({
    where: { id: data.session.user.id },
  });

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <main>
      <h1 className="mb-8 text-center text-2xl">Admin page</h1>
      <pre>{JSON.stringify({ profile }, null, 4)}</pre>
    </main>
  );
}
