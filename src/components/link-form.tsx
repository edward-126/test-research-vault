"use client";

import {
  LinkFields,
  parseTagsInput,
  type LinkFieldValues,
} from "@/components/link-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateLinkInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<keyof CreateLinkInput, string>>;
  values: LinkFieldValues;
};

const initialFormState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {
    url: "",
    title: "",
    notes: "",
    category: "",
    tagsInput: "",
    tags: [],
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
        status: current.status === "success" ? "idle" : current.status,
        message: current.status === "success" ? "" : current.message,
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
      };

      if (!response.ok) {
        setState((current) => ({
          ...current,
          status: "error",
          message:
            data.message ?? "Please fix the highlighted fields and try again.",
          fieldErrors: data.fieldErrors ?? {},
        }));
        return;
      }

      setState({
        ...initialFormState,
        status: "success",
        message: data.message ?? "Research link saved to the vault.",
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
          Save the source, add quick notes, tags, and category details so the
          team can organize research from the start.
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

          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div
              className={cn(
                "rounded-lg px-1.5 py-1 text-sm",
                state.status === "success" &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
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
