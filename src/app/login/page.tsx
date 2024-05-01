import { LoginForm } from "@/app/_components/LoginForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    redirect("/");
  }

  return (
    <main className="m-auto max-w-lg">
      <h1 className="mb-6 text-center text-2xl">Login</h1>
      <LoginForm />
    </main>
  );
}
