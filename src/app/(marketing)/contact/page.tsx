import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Cloud-LB on WhatsApp or leave a note through your account.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Contact
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        The fastest way to reach us is WhatsApp — we&apos;ll help you evaluate
        fit, pricing, and rollout.
      </p>
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Primary channel</p>
        <div className="mt-4">
          <WhatsAppCta />
        </div>
        <p className="mt-6 text-sm text-slate-500">
          For existing customers, use the in-app dashboard for support requests
          as we expand tooling.
        </p>
      </div>
    </div>
  );
}
