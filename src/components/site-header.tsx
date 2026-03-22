import Image from "next/image";
import Link from "next/link";

const nav = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="Cloud-LB"
            width={200}
            height={72}
            className="h-11 w-auto max-h-12 object-contain object-left sm:h-12"
            priority
            sizes="(max-width: 640px) 160px, 200px"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
