import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Plans for dental practices — start on WhatsApp, scale when you need.",
};

const tiers = [
  {
    name: "Basic",
    price: "Let’s talk",
    items: ["Single location", "Core chatbot", "Email support"],
  },
  {
    name: "Pro",
    price: "Let’s talk",
    items: ["Higher message volume", "Customization", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Let’s talk",
    items: ["Multi-site", "SLA options", "Dedicated success"],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-center text-4xl font-bold tracking-tight text-slate-900">
        Pricing
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
        We keep billing simple while you validate fit. Reach out on WhatsApp for
        a quote tailored to your clinic — Stripe checkout is coming soon.
      </p>
      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`flex min-h-[320px] flex-col rounded-2xl border p-8 ${
              t.featured
                ? "border-emerald-500/50 bg-emerald-50/60 shadow-xl shadow-emerald-500/10"
                : "border-slate-200 bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold text-slate-900">{t.name}</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">{t.price}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
              {t.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-teal-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto w-full shrink-0 pt-8">
              <WhatsAppCta className="w-full" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
