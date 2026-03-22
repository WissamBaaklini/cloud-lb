import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
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
      <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white md:w-56 md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex h-14 shrink-0 items-center border-b border-slate-100 px-4 md:h-auto md:border-0 md:px-4 md:pb-2 md:pt-6">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Cloud-LB"
              width={160}
              height={48}
              className="h-9 w-auto max-w-[148px] object-contain object-left sm:h-10 sm:max-w-[160px]"
              priority
            />
          </Link>
        </div>

        <nav className="hidden flex-1 flex-col gap-0.5 px-2 pb-2 md:flex md:px-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-4 py-4">
          <p className="truncate text-xs font-medium text-slate-600">
            {profile?.full_name || user.email}
          </p>
          <SignOutButton className="self-start text-left text-sm font-medium text-slate-600 hover:text-slate-900" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-4 md:hidden">
          <nav className="flex gap-4 overflow-x-auto text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap text-slate-700 hover:text-slate-900"
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
