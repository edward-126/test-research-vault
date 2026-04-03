"use client";

import {
  formatTagsInput,
  LinkFields,
  parseTagsInput,
  type LinkFieldValues,
} from "@/components/link-fields";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LinkFilters, LinkItem, UpdateLinkInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FilePenLine,
  FolderKanban,
  LoaderCircle,
  Tag,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(date);
}

function buildEditorValues(link: LinkItem): LinkFieldValues {
  return {
    url: link.url,
    title: link.title,
    notes: link.notes,
    category: link.category,
    tagsInput: formatTagsInput(link.tags),
    tags: link.tags,
  };
}

function buildFilterHref(pathname: string, filters: LinkFilters) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.tag.trim()) {
    params.set("tag", filters.tag.trim());
  }

  return params.toString() ? `${pathname}?${params.toString()}` : pathname;
}

export function LinkList({
  links,
  setupError,
  filters,
}: {
  links: LinkItem[];
  setupError?: string;
  filters: LinkFilters;
}) {
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editorValues, setEditorValues] = useState<LinkFieldValues | null>(
    null
  );
  const [editErrors, setEditErrors] = useState<
    Partial<Record<keyof UpdateLinkInput, string>>
  >({});
  const [actionMessage, setActionMessage] = useState("");
  const [actionStatus, setActionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  function setMessage(status: "success" | "error", message: string) {
    setActionStatus(status);
    setActionMessage(message);
  }

  function updateFilter(nextFilters: LinkFilters) {
    startTransition(() => {
      router.replace(buildFilterHref(pathname, nextFilters));
    });
  }

  function clearFilters() {
    updateFilter({
      search: "",
      category: "",
      tag: "",
    });
  }

  function openEditor(link: LinkItem) {
    setEditingLink(link);
    setEditorValues(buildEditorValues(link));
    setEditErrors({});
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setEditingLink(null);
      setEditorValues(null);
      setEditErrors({});
    }
  }

  function updateEditorValue(field: keyof LinkFieldValues, value: string) {
    setEditorValues((current) => {
      if (!current) {
        return current;
      }

      return field === "tagsInput"
        ? {
            ...current,
            tagsInput: value,
            tags: parseTagsInput(value),
          }
        : {
            ...current,
            [field]: value,
          };
    });

    setEditErrors((current) => {
      const next = { ...current };

      if (field === "tagsInput") {
        delete next.tags;
      } else {
        delete next[field as keyof UpdateLinkInput];
      }

      return next;
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingLink || !editorValues) {
      return;
    }

    setIsSaving(true);

    const payload: UpdateLinkInput = {
      url: editorValues.url,
      title: editorValues.title,
      notes: editorValues.notes,
      category: editorValues.category,
      tags: editorValues.tags,
    };

    try {
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: Partial<Record<keyof UpdateLinkInput, string>>;
      };

      if (!response.ok) {
        setEditErrors(data.fieldErrors ?? {});
        setMessage(
          "error",
          data.message ?? "Please fix the highlighted fields and try again."
        );
        return;
      }

      setEditingLink(null);
      setEditorValues(null);
      setEditErrors({});
      setMessage("success", data.message ?? "Research link updated.");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to update link from list", error);
      setMessage("error", "The link could not be updated right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(link: LinkItem) {
    setIsDeletingId(link.id);

    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(
          "error",
          data.message ?? "The link could not be deleted right now."
        );
        return;
      }

      setMessage("success", data.message ?? "Research link deleted.");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete link from list", error);
      setMessage("error", "The link could not be deleted right now.");
    } finally {
      setIsDeletingId("");
    }
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.tag
  );

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
    <Card>
      <CardHeader className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-medium tracking-tight">
            Shared research vault
            <small className="text-muted-foreground text-xs font-medium">
              (
              <span className="text-primary dark:text-chart-2">
                {links.length}
              </span>{" "}
              {links.length === 1 ? "item" : "items"} captured)
            </small>
          </CardTitle>
          <CardDescription className="mt-1 leading-6">
            Manage saved sources, refine the list with filters, and keep the
            Sprint 2 walkthrough easy to follow.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {actionMessage ? (
          <div
            className={cn(
              "mb-4 rounded-2xl px-4 py-3 text-sm",
              actionStatus === "success" &&
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              actionStatus === "error" && "bg-destructive/10 text-destructive"
            )}
          >
            {actionMessage}
          </div>
        ) : null}

        {links.length === 0 ? (
          <div className="rounded-[28px] border border-dashed px-5 py-10 text-center">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
              {hasActiveFilters
                ? "No links match these filters"
                : "No research links yet"}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {hasActiveFilters
                ? "Try clearing the active filters or use a broader search to surface more results."
                : "Add the first article, dataset, or tool above to start building the shared research vault."}
            </p>
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={clearFilters}
              >
                Clear current filters
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <Card
                key={link.id}
                className="hover:bg-primary/2 bg-accent/50 hover:border-primary/20 transition-all duration-300 ease-in-out"
              >
                <CardContent>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-primary/5 dark:border-chart-2/10 dark:bg-chart-2/5 border-primary/10 text-primary dark:text-chart-2 inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-xs font-semibold">
                          <FolderKanban className="size-3.5" />
                          {link.category}
                        </span>
                        <span className="text-muted-foreground text-xs tracking-tighter">
                          Added {formatTimestamp(link.createdAt)}
                        </span>
                        {link.updatedAt.getTime() !==
                        link.createdAt.getTime() ? (
                          <span className="text-muted-foreground text-xs">
                            Updated {formatTimestamp(link.updatedAt)}
                          </span>
                        ) : null}
                      </div>

                      <h5 className="mt-2.5 text-lg font-medium tracking-tight">
                        {link.title}
                      </h5>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary dark:text-chart-2 hover:text-foreground mt-2 inline-flex max-w-full items-center gap-2 text-sm underline underline-offset-4 transition"
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

                      {link.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {link.tags.map((tagValue) => {
                            const isActiveTag =
                              filters.tag.toLocaleLowerCase() ===
                              tagValue.toLocaleLowerCase();

                            return (
                              <button
                                key={tagValue}
                                type="button"
                                onClick={() =>
                                  updateFilter({
                                    ...filters,
                                    tag: isActiveTag ? "" : tagValue,
                                  })
                                }
                                className="cursor-pointer"
                              >
                                <Badge
                                  variant={
                                    isActiveTag ? "default" : "secondary"
                                  }
                                  className="gap-1.5"
                                >
                                  <Tag className="size-3" />
                                  {tagValue}
                                </Badge>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2 lg:flex-col">
                      <Dialog
                        open={editingLink?.id === link.id}
                        onOpenChange={handleDialogOpenChange}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditor(link)}
                          >
                            <FilePenLine />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit research link</DialogTitle>
                            <DialogDescription>
                              Update the source details, notes, category, or
                              tags without losing the original capture date.
                            </DialogDescription>
                          </DialogHeader>

                          {editorValues ? (
                            <form
                              onSubmit={handleSave}
                              className="flex flex-col gap-4"
                            >
                              <LinkFields
                                values={editorValues}
                                errors={editErrors}
                                onValueChange={updateEditorValue}
                                onCategoryChange={(value) =>
                                  updateEditorValue("category", value)
                                }
                              />
                              <DialogFooter className="border-border border-t pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleDialogOpenChange(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                  {isSaving ? (
                                    <>
                                      <LoaderCircle className="animate-spin" />
                                      Saving
                                    </>
                                  ) : (
                                    "Save changes"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          ) : null}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="ghost" size="sm">
                            <Trash2 />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this link?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes <strong>{link.title}</strong> from
                              the shared vault. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(link)}
                              disabled={isDeletingId === link.id}
                            >
                              {isDeletingId === link.id ? (
                                <>
                                  <LoaderCircle className="animate-spin" />
                                  Deleting
                                </>
                              ) : (
                                "Delete link"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
