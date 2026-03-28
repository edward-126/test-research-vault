"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Plus, Sparkles } from "lucide-react";
import { createLinkAction, initialCreateLinkActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LINK_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full justify-center bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent-strong))] text-white shadow-[0_18px_45px_-22px_var(--color-primary-shadow)] hover:opacity-95 sm:w-auto"
      disabled={pending}
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Plus className="size-4" />
          Save Link
        </>
      )}
    </Button>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {label}
      </span>
      {children}
      <span
        className={cn(
          "min-h-5 text-sm",
          error ? "text-rose-600 dark:text-rose-400" : "text-transparent"
        )}
      >
        {error ?? "No validation error"}
      </span>
    </label>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary-soft)] dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500";

export function LinkForm() {
  const [state, formAction] = useActionState(
    createLinkAction,
    initialCreateLinkActionState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <section className="rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="bg-var(--color-primary-soft) text-var(--color-primary-strong) inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="size-3.5" />
            Sprint 1 MVP
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Capture a research link
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Save the source, add quick notes, and keep the team&apos;s research
            vault organized from day one.
          </p>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="mt-8 space-y-5">
        <Field label="Research URL" error={state.fieldErrors.url}>
          <input
            type="url"
            name="url"
            placeholder="https://example.com/paper"
            defaultValue={state.values.url}
            className={inputClassName}
            aria-invalid={Boolean(state.fieldErrors.url)}
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" error={state.fieldErrors.title}>
            <input
              type="text"
              name="title"
              placeholder="Understanding distributed systems"
              defaultValue={state.values.title}
              className={inputClassName}
              aria-invalid={Boolean(state.fieldErrors.title)}
            />
          </Field>

          <Field label="Category" error={state.fieldErrors.category}>
            <select
              name="category"
              defaultValue={state.values.category}
              className={inputClassName}
              aria-invalid={Boolean(state.fieldErrors.category)}
            >
              <option value="">Choose a category</option>
              {LINK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Notes" error={state.fieldErrors.notes}>
          <textarea
            name="notes"
            rows={5}
            placeholder="Why is this source useful? Key takeaways, methodology, or critique."
            defaultValue={state.values.notes}
            className={cn(inputClassName, "resize-y")}
          />
        </Field>

        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm",
              state.status === "success" &&
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              state.status === "error" &&
                "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
              state.status === "idle" &&
                "bg-slate-100/80 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            )}
          >
            {state.message ||
              "Saved links appear instantly in the shared vault."}
          </div>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
