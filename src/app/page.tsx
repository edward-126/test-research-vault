import { Database, GitBranch, Rocket } from "lucide-react";
import { LinkForm } from "@/components/link-form";
import { LinkList } from "@/components/link-list";
import { listLinks } from "@/lib/research-links";
import type { LinkItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let links: LinkItem[] = [];
  let setupError = "";

  try {
    links = await listLinks();
  } catch (error) {
    console.error("Failed to load research links", error);
    setupError =
      error instanceof Error
        ? error.message
        : "Unable to connect to MongoDB for the shared vault.";
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.32),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.28),_transparent_22%),linear-gradient(180deg,_#fffdf8_0%,_#eef6ff_55%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#111827_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[linear-gradient(135deg,rgba(15,23,42,0.04),rgba(15,23,42,0))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />

      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-6 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[36px] border border-white/70 bg-white/70 p-7 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-primary-strong)]">
              Advanced Topics in Software Engineering
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
              ResearchVault keeps Sprint 1 focused on the core research capture
              flow.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Build the MVP that matters first: save a source, add a title,
              keep notes, assign one category, and prove the full stack works
              with Next.js, MongoDB Atlas, and Vercel-ready configuration.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Rocket,
                  title: "Prototype 1",
                  copy: "A clean, demo-ready MVP centered on one essential workflow.",
                },
                {
                  icon: Database,
                  title: "Atlas-backed",
                  copy: "Shared persistence for local development and Vercel deployment.",
                },
                {
                  icon: GitBranch,
                  title: "Branch-first",
                  copy: "Built on a dedicated Sprint 1 feature branch for clean PR evidence.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/75"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
                    <item.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-slate-200/70 bg-slate-950 p-7 text-slate-50 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.55)] lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              Sprint 1 checklist
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Create and store a research link in MongoDB Atlas",
                "Render the shared vault from the server on page load",
                "Show clear validation and friendly submission feedback",
                "Keep the project ready for GitHub Actions and Vercel",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-amber-300">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <LinkForm />
          <LinkList links={links} setupError={setupError} />
        </div>
      </div>
    </section>
  );
}
