import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "Features",
  description:
    "24/7 chatbot, booking flows, knowledge base, dashboard, and embeddable widget.",
};

const blocks = [
  {
    title: "Patient-ready chat",
    body: "Natural conversations tuned for common dental questions — hours, insurance basics, and prep instructions.",
  },
  {
    title: "Knowledge you control",
    body: "Upload documents and FAQs. Your bot cites what you approved — not the open web.",
  },
  {
    title: "Dashboard & analytics",
    body: "See volume, tune prompts, and manage bots from one place (more metrics rolling out).",
  },
  {
    title: "Embeddable widget",
    body: "Drop-in script for your site so visitors get help without leaving the page.",
  },
  {
    title: "API access (soon)",
    body: "Wire Cloud-LB into your stack when you are ready for programmatic control.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-center text-4xl font-bold tracking-tight text-slate-900">
        Features
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
        A focused toolkit for clinics that want AI without chaos.
      </p>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{b.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {b.body}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <WhatsAppCta />
        <Link
          href="/signup"
          className="text-sm font-semibold text-teal-800 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
