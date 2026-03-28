import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LinkItem } from "@/lib/types";
import { ExternalLink, FolderKanban } from "lucide-react";

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
      <Card className="rounded-[32px] border-amber-200 bg-amber-50/90 text-amber-900 shadow-[0_25px_80px_-35px_rgba(120,53,15,0.35)] dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
        <CardHeader>
          <CardDescription className="text-sm font-semibold tracking-[0.2em] text-current uppercase">
            Database setup needed
          </CardDescription>
          <CardTitle className="text-2xl tracking-tight">
            Connect MongoDB Atlas before using the vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-2xl text-sm leading-6 text-amber-800 dark:text-amber-200">
            {setupError}
          </p>
          <p className="mt-4 text-sm leading-6 text-amber-800 dark:text-amber-200">
            Add `MONGODB_URI` and `MONGODB_DB_NAME` to your local env file and
            Vercel project settings, then refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-medium tracking-tight">
            Shared research vault
          </CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">
          {links.length} {links.length === 1 ? "item" : "items"} captured
        </p>
      </CardHeader>

      <CardContent>
        {links.length === 0 ? (
          <div className="">
            <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-slate-50">
              No research links yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Add the first article, dataset, or tool above to start building
              the Sprint 1 prototype.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <Card
                key={link.id}
                className="hover:bg-primary/2 hover:border-primary/20 transition-all duration-300 ease-in-out"
              >
                <CardContent className="">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-primary/5 border-primary/10 text-primary inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-xs font-semibold">
                          <FolderKanban className="size-3.5" />
                          {link.category}
                        </span>
                        <span className="text-muted-foreground text-xs tracking-tighter">
                          {formatCreatedAt(link.createdAt)}
                        </span>
                      </div>

                      <h5 className="mt-2.5 text-lg font-medium tracking-tight">
                        {link.title}
                      </h5>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-foreground mt-2 inline-flex max-w-full items-center gap-2 text-sm underline underline-offset-4 transition"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </a>

                      {link.notes ? (
                        <p className="text-muted-foreground mt-4 text-sm leading-6">
                          {link.notes}
                        </p>
                      ) : (
                        <p className="mt-4 text-sm text-slate-400 italic dark:text-slate-500">
                          No notes added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
