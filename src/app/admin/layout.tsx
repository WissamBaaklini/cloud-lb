import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/bots", label: "Bots" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "System" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, disabled, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.disabled || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 md:flex-row">
      <aside className="border-b border-slate-800 bg-slate-900 md:w-56 md:border-b-0 md:border-r">
        <div className="flex h-14 items-center px-4 font-semibold text-white">
          {APP_NAME} Admin
        </div>
        <nav className="flex flex-col gap-1 px-2 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
          <p className="truncate">{profile.full_name || user.email}</p>
          <div className="mt-2 flex gap-3">
            <Link href="/dashboard" className="text-teal-400 hover:underline">
              User app
            </Link>
            <SignOutButton className="text-sm font-medium text-slate-400 hover:text-white" />
          </div>
        </div>
      </aside>
      <div className="flex-1 overflow-auto p-4 sm:p-8">{children}</div>
    </div>
  );
}
