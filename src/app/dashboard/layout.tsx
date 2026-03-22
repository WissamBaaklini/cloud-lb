import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/bots", label: "Chatbots" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 md:flex-row">
      <aside className="border-b border-slate-200 bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="flex h-14 items-center justify-between px-4 md:flex-col md:items-stretch md:gap-6 md:py-6">
          <Link href="/dashboard" className="font-semibold text-slate-900">
            {APP_NAME}
          </Link>
          <nav className="hidden gap-1 md:flex md:flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 md:flex-col md:items-stretch md:gap-2">
          <p className="truncate text-xs text-slate-500">
            {profile?.full_name || user.email}
          </p>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-slate-200 bg-white px-4 md:hidden">
          <nav className="flex gap-3 overflow-x-auto text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap text-slate-600"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="flex-1 p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
