import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;

  if (user) {
    redirect(params.next ?? "/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-stone-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="text-center text-sm font-semibold text-teal-800">
          ← {` `}Back to home
        </Link>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access your dashboard and chatbots.
          </p>
          <LoginForm next={params.next} />
          <p className="mt-6 text-center text-sm text-slate-600">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-teal-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
