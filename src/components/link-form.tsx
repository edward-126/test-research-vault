"use client";

import {
  LinkFields,
  parseTagsInput,
  type LinkFieldValues,
} from "@/components/link-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_LINK_STATUS,
  type CreateLinkInput,
  type DuplicateWarning,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type FormState = {
  status: "idle" | "success" | "warning" | "error";
  message: string;
  fieldErrors: Partial<Record<keyof CreateLinkInput, string>>;
  values: LinkFieldValues;
  duplicateWarning: DuplicateWarning | null;
};

const initialFormState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  duplicateWarning: null,
  values: {
    url: "",
    title: "",
    notes: "",
    category: "",
    tagsInput: "",
    tags: [],
    status: DEFAULT_LINK_STATUS,
  },
};

export function LinkForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  function updateValue(field: keyof LinkFieldValues, value: string) {
    setState((current) => {
      const nextValues =
        field === "tagsInput"
          ? {
              ...current.values,
              tagsInput: value,
              tags: parseTagsInput(value),
            }
          : {
              ...current.values,
              [field]: value,
            };

      const nextFieldErrors = { ...current.fieldErrors };

      if (field === "tagsInput") {
        delete nextFieldErrors.tags;
      } else {
        delete nextFieldErrors[field as keyof CreateLinkInput];
      }

      return {
        ...current,
        status:
          current.status === "success" || current.status === "warning"
            ? "idle"
            : current.status,
        message:
          current.status === "success" || current.status === "warning"
            ? ""
            : current.message,
        duplicateWarning: null,
        fieldErrors: nextFieldErrors,
        values: nextValues,
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values: CreateLinkInput = {
      url: state.values.url,
      title: state.values.title,
      notes: state.values.notes,
      category: state.values.category,
      tags: state.values.tags,
      status: state.values.status,
      isFavorite: false,
    };

    setIsPending(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: FormState["fieldErrors"];
        duplicateWarning?: DuplicateWarning;
      };

      if (!response.ok) {
        setState((current) => ({
          ...current,
          status: "error",
          message:
            data.message ?? "Please fix the highlighted fields and try again.",
          duplicateWarning: null,
          fieldErrors: data.fieldErrors ?? {},
        }));
        return;
      }

      setState({
        ...initialFormState,
        status: data.duplicateWarning ? "warning" : "success",
        message: data.duplicateWarning
          ? data.duplicateWarning.message
          : (data.message ?? "Research link saved to the vault."),
        duplicateWarning: data.duplicateWarning ?? null,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to save link from form", error);

      setState((current) => ({
        ...current,
        status: "error",
        message:
          "The link could not be saved right now. Check your connection and try again.",
        duplicateWarning: null,
        fieldErrors: {},
      }));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-medium tracking-tight">
          Capture a research link
        </CardTitle>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          Save the source, keep the default reading status in place, and surface
          duplicate warnings before the vault gets noisy.
        </p>
      </CardHeader>

      <CardContent className="mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-stretch gap-4"
        >
          <LinkFields
            values={state.values}
            errors={state.fieldErrors}
            onValueChange={updateValue}
            onCategoryChange={(value) => updateValue("category", value)}
          />

          {state.duplicateWarning ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">
                    {state.duplicateWarning.message}
                  </p>
                  <p className="text-xs leading-5 text-amber-800 dark:text-amber-200">
                    Existing item: {state.duplicateWarning.existingLink.title} (
                    {state.duplicateWarning.existingLink.status})
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              className={cn(
                "rounded-lg px-1.5 py-1 text-sm",
                state.status === "success" &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                state.status === "warning" &&
                  "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
                state.status === "error" &&
                  "bg-destructive/10 text-destructive",
                state.status === "idle" && "bg-muted text-muted-foreground"
              )}
            >
              {state.message ||
                "Saved links will appear in the shared vault once they match the current filters."}
            </div>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus />
                  Save Link
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
