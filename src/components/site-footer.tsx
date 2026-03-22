import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-slate-900">{APP_NAME}</p>
          <p className="mt-1 max-w-sm text-sm text-slate-600">
            AI chatbots built for dental practices — appointments, answers, and
            trust around the clock.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-900">Product</span>
            <Link href="/features" className="text-slate-600 hover:text-teal-700">
              Features
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-teal-700">
              Pricing
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-slate-900">Company</span>
            <Link href="/about" className="text-slate-600 hover:text-teal-700">
              About
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-teal-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
