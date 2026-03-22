import Link from "next/link";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    title: "24/7 chatbot",
    desc: "Never miss a patient question — instant replies day and night.",
  },
  {
    title: "Appointment booking",
    desc: "Let visitors book slots that fit your calendar and policies.",
  },
  {
    title: "Trained on your clinic",
    desc: "Upload FAQs and policies so answers match your voice and rules.",
  },
];

const steps = [
  { step: "1", title: "Sign up", desc: "Create your account and workspace." },
  {
    step: "2",
    title: "Upload data",
    desc: "Add documents and clinic information your bot should know.",
  },
  {
    step: "3",
    title: "Get your chatbot",
    desc: "Customize, embed, and go live on your site in minutes.",
  },
];

const plans = [
  {
    name: "Basic",
    price: "Custom",
    blurb: "Perfect to get started with one location.",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Custom",
    blurb: "Advanced customization and higher usage.",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "Multi-site, SLAs, and dedicated support.",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white to-teal-50/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(20,184,166,0.18),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:items-center lg:gap-12 lg:py-32">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              {APP_NAME}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              AI chatbots for dentists
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Turn your website into a front desk that never sleeps — book
              visits, answer common questions, and keep every reply aligned with
              your practice.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <WhatsAppCta />
              <Link
                href="/signup"
                className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
              >
                Or create an account →
              </Link>
            </div>
          </div>
          <div className="mt-14 hidden flex-1 lg:mt-0 lg:block">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-500">
                  Live preview
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  Do you take new patients this week?
                </div>
                <div className="rounded-lg bg-teal-50 p-3 text-slate-800">
                  Yes — we have openings Tuesday and Thursday. Would you like to
                  book a slot?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Built for busy clinics
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Everything you need to deploy a trustworthy assistant without a dev
          team.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Start on WhatsApp — we&apos;ll align a plan to your clinic size and
          volume.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex min-h-[280px] flex-col rounded-2xl border p-6 ${
                p.highlight
                  ? "border-emerald-500/50 bg-emerald-50/60 shadow-lg shadow-emerald-500/10"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">{p.price}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {p.blurb}
              </p>
              <div className="mt-8 w-full shrink-0">
                <WhatsAppCta className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-900 py-16 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready when you are</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-300">
          Message us on WhatsApp to onboard — we&apos;ll help you launch fast.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppCta className="!bg-emerald-500 shadow-lg shadow-black/20 hover:!bg-emerald-400" />
        </div>
      </section>
    </>
  );
}
