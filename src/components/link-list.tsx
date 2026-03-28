import { ExternalLink, FolderKanban, NotebookPen } from "lucide-react";
import type { LinkItem } from "@/lib/types";

function formatCreatedAt(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function LinkList({
  links,
  setupError,
}: {
  links: LinkItem[];
  setupError?: string;
}) {
  if (setupError) {
    return (
      <section className="rounded-[32px] border border-amber-200 bg-amber-50/90 p-6 text-amber-900 shadow-[0_25px_80px_-35px_rgba(120,53,15,0.35)] dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase">
          Database setup needed
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Connect MongoDB Atlas before using the vault
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-800 dark:text-amber-200">
          {setupError}
        </p>
        <p className="mt-4 text-sm leading-6 text-amber-800 dark:text-amber-200">
          Add `MONGODB_URI` and `MONGODB_DB_NAME` to your local env file and
          Vercel project settings, then refresh the page.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/82 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            Saved links
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Shared research vault
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {links.length} {links.length === 1 ? "item" : "items"} captured
        </p>
      </div>

      {links.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/90 p-8 text-center dark:border-white/15 dark:bg-slate-900/60">
          <div className="bg-var(--color-primary-soft) text-var(--color-primary-strong) mx-auto flex size-14 items-center justify-center rounded-2xl">
            <NotebookPen className="size-7" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-slate-50">
            No research links yet
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Add the first article, dataset, or tool above to start building the
            Sprint 1 prototype.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {links.map((link) => (
            <article
              key={link.id}
              className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-950/80"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-var(--color-primary-soft) text-var(--color-primary-strong) inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
                      <FolderKanban className="size-3.5" />
                      {link.category}
                    </span>
                    <span className="text-xs tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                      {formatCreatedAt(link.createdAt)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                    {link.title}
                  </h3>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-var(--color-primary-strong) decoration-color:var(--color-primary-strong)/25 hover:decoration-color:var(--color-primary-strong) mt-2 inline-flex max-w-full items-center gap-2 text-sm underline underline-offset-4 transition"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="size-4 shrink-0" />
                  </a>

                  {link.notes ? (
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {link.notes}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400 italic dark:text-slate-500">
                      No notes added yet.
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
