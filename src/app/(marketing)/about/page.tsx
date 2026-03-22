import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${APP_NAME} and our mission for dental practices.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        About {APP_NAME}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-slate-600">
        We help dental teams deliver fast, accurate answers on the web — without
        stretching your front desk. {APP_NAME} combines secure hosting, clear
        governance, and AI that respects how your clinic actually works.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Our roadmap includes deeper analytics, richer knowledge tooling, and
        first-class APIs so you can plug assistants into the systems you already
        use.
      </p>
    </div>
  );
}
